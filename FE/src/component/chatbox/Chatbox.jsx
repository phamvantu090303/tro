import { useEffect, useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { axiosInstance } from "../../../Axios";
import { useSelector } from "react-redux";
import { connectSocket } from "../../../Socket";
import { motion } from "framer-motion";
const Chatbox = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  // Lấy danh sách tin nhắn
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/tin-nhan/messs");
      setMessages(res.data.data);
    } catch (error) {
      console.log("Lỗi khi lấy tin nhắn:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const s = connectSocket(token);
    setSocket(s);

    // Đăng ký sự kiện socket chỉ một lần
    s.on("nhan_tin_nhan_admin", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.payload]);
    });

    // Cleanup khi socket bị ngắt kết nối
    return () => {
      s.off("nhan_tin_nhan_admin");
      s.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (input.trim() === "") return;

    try {
      // Gửi tin nhắn qua socket

      const message = {
        noi_dung: input,
      };
      socket.emit("gui_tin_nhan", { payload: message });

      setInput("");
      setMessages((prevMessages) => [
        ...prevMessages,
        { noi_dung: input, nguoi_gui: user.id },
      ]);
    } catch (error) {
      console.log("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className="fixed bottom-0 md:bottom-5 right-0 md:right-5 z-50 w-full sm:w-auto">
      {isOpen ? (
        <motion.div
          className="w-full sm:w-[20rem] bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col h-[500px]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <span>Hỗ trợ khách hàng</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Message area */}
          <div className="flex-1 overflow-y-auto max-h-[400px] p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.nguoi_gui === user.id ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`p-2 rounded-md text-sm sm:text-base md:text-lg break-words max-w-[80%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] ${
                    msg.nguoi_gui === user.id
                      ? "bg-blue-500 self-end ml-auto text-right text-white"
                      : "bg-gray-200 self-start mr-auto"
                  }`}
                >
                  {msg.noi_dung}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center border-t border-gray-200 p-2">
            <input
              type="text"
              className="flex-1 border-none focus:outline-none px-2 py-1"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="text-blue-600 px-2">
              <IoSend size={20} />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AiOutlineMessage size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default Chatbox;
