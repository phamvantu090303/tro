import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../../../../Axios";
import { motion } from "framer-motion";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { connectSocket } from "../../../../../Socket";

const ChatAdmin = () => {
  const { token } = useSelector((state) => state.authAdmin);
  const [userName, setUserName] = useState("");
  const [DanhsachUser, setDanhsachUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const fetchMessages = async (userId) => {
    try {
      const res = await axiosInstance.get(`/tin-nhan/messAdmin/${userId}`);
      return res.data.data;
    } catch (error) {
      console.log("Lỗi khi fetch tin nhắn:", error);
    }
  };
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    const messages = await fetchMessages(user._id);
    setMessages(messages);
  };

  // Hàm quay lại danh sách người dùng trên mobile
  const handleBack = () => {
    setSelectedUser(null);
  };
  useEffect(() => {
    const s = connectSocket(token);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token]); // Chỉ khi token thay đổi thì mới kết nối lại

  useEffect(() => {
    if (!selectedUser) return;

    // Lắng nghe sự kiện nhận tin nhắn khi selectedUser đã được chọn
    const handleNewMessage = (data) => {
      if (data.payload.nguoi_gui === selectedUser._id) {
        setMessages((prevMessages) => [...prevMessages, data.payload]);
      }
    };

    socket?.on("nhan_tin_nhan", handleNewMessage);

    // Cleanup lắng nghe sự kiện khi user thay đổi
    return () => {
      socket?.off("nhan_tin_nhan", handleNewMessage);
    };
  }, [selectedUser, socket]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [resUsers, resAdmin] = await Promise.all([
        axiosInstance.get("/auth/AllUser"),
        axiosInstance.get("/admin/getadmin"),
      ]);
      const users = resUsers.data.data;
      setDanhsachUser(users);
      setUserName(resAdmin.data.data);
      if (users.length > 0 && window.innerWidth > 768) {
        handleSelectUser(users[0]);
      }
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (DanhsachUser.length > 0 && window.innerWidth > 768 && !selectedUser) {
        handleSelectUser(DanhsachUser[0]);
      } else if (window.innerWidth <= 768 && selectedUser) {
        handleSelectUser(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [DanhsachUser, selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMess = async (e) => {
    e.preventDefault();
    const text = e.target.message.value.trim();
    if (!text || !selectedUser) return;

    socket.emit("admin_gui_tin_nhan", {
      payload: {
        nguoi_nhan: selectedUser._id,
        noi_dung: text,
      },
    });

    const updatedMessages = await fetchMessages(selectedUser._id);
    setMessages(updatedMessages);

    e.target.reset();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Sidebar */}
      <motion.div
        className={`w-full md:w-80 lg:w-96 shadow-lg bg-white rounded-lg overflow-auto ${
          selectedUser ? "hidden md:block" : "block"
        }`}
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-8 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg
              className="absolute left-2 top-2.5 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Danh sách user */}
        <div className="overflow-auto space-y-2">
          {DanhsachUser.map((chat, index) => (
            <motion.div
              key={index}
              onClick={() => handleSelectUser(chat)}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === chat._id ? "bg-blue-50" : ""
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <FaRegUserCircle size={35} />
              <div className="ml-3">
                <div className="flex justify-between">
                  <h3 className="text-sm font-semibold truncate">
                    {chat.username}
                  </h3>
                  {chat.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chat Box */}
      {selectedUser && (
        <div className="w-full flex flex-col bg-white rounded-lg h-[90vh] shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <button className="md:hidden text-gray-600" onClick={handleBack}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="font-semibold text-gray-800">
              {selectedUser.username}
            </span>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => {
              return (
                <div
                  key={idx}
                  className={`flex ${
                    msg.nguoi_gui === userName._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <p
                    className={`p-2 rounded-md text-sm sm:text-base md:text-lg break-words max-w-[80%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] ${
                      msg.nguoi_gui === userName._id
                        ? "bg-blue-500 text-white text-right"
                        : "bg-gray-200 text-gray-800 text-left"
                    }`}
                  >
                    {msg.noi_dung}
                  </p>
                </div>
              );
            })}

            <div ref={messageEndRef} />
          </div>

          {/* Form gửi tin nhắn */}
          <form
            className="border-t flex gap-2 h-[60px] p-2"
            onSubmit={handleSendMess}
          >
            <input
              type="text"
              name="message"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border p-2 rounded-md text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 sm:px-4 rounded-md text-sm sm:text-base"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAdmin;
