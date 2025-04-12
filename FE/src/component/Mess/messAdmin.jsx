import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { axiosInstance } from "../../../Axios";
import { FaPaperPlane } from "react-icons/fa";

// Khởi tạo socket với authorization từ localStorage
const authorization = localStorage.getItem("authorization");
const socket = io("https://bephongtro.hoclaptrinhiz.com", {
  auth: { Authorization: authorization },
  transports: ["websocket"],
});

const ChatAdmin = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nguoiNhan, setNguoiNhan] = useState("");
  const [nguoiGui, setNguoiGui] = useState("");
  const [userName, setUserName] = useState("");
  const [danhSachAdmin, setDanhSachAdmin] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Xử lý trạng thái kết nối socket
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Đã kết nối socket:", socket.id);
      setIsConnected(true);
    });
    socket.on("connect_error", (err) => {
      console.error("Lỗi kết nối Socket:", err.message);
      setIsConnected(false);
    });
    socket.on("disconnect", () => {
      console.log("Socket đã ngắt kết nối");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  // Lấy thông tin admin
  useEffect(() => {
    axiosInstance
      .get("/admin/getadmin")
      .then(({ data }) => {
        setNguoiGui(data.data._id);
        setUserName(data.data.username);
      })
      .catch((error) => console.error("Lỗi lấy thông tin admin:", error));
  }, []);

  // Lấy danh sách user
  useEffect(() => {
    axiosInstance
      .get("/auth/AllUser")
      .then(({ data }) => setDanhSachAdmin(data.data))
      .catch((error) => console.error("Lỗi lấy danh sách user:", error));
  }, []);

  // Lấy lịch sử tin nhắn khi thay đổi người nhận
  useEffect(() => {
    if (!nguoiGui || !nguoiNhan) return;

    axiosInstance
      .get(`/tin-nhan/messAdmin/${nguoiNhan}`)
      .then(({ data }) => setMessages(data.data || []))
      .catch((error) => console.error("Lỗi lấy tin nhắn:", error));
  }, [nguoiGui, nguoiNhan]);

  // Lắng nghe tin nhắn mới từ Socket.IO
  useEffect(() => {
    if (!nguoiGui || !nguoiNhan || !isConnected) return;

    const handleReceiveMessage = ({ payload }) => {
      if (
        (payload.nguoi_gui === nguoiGui && payload.nguoi_nhan === nguoiNhan) ||
        (payload.nguoi_gui === nguoiNhan && payload.nguoi_nhan === nguoiGui)
      ) {
        setMessages((prev) => [...prev, payload]);
      }
    };

    socket.on("nhan_tin_nhan", handleReceiveMessage);
    return () => socket.off("nhan_tin_nhan", handleReceiveMessage);
  }, [nguoiGui, nguoiNhan, isConnected]);

  // Gửi tin nhắn
  const sendMessage = useCallback(() => {
    if (!message.trim() || !nguoiNhan) {
      alert("Vui lòng nhập tin nhắn và chọn người nhận!");
      return;
    }

    if (!isConnected) {
      alert("Không thể gửi tin nhắn: Mất kết nối với server!");
      return;
    }

    const newMessage = { nguoi_gui: nguoiGui, nguoi_nhan: nguoiNhan, noi_dung: message };
    socket.emit("gui_tin_nhan", { payload: newMessage });
    setMessages((prev) => [...prev, newMessage]); // Thêm tin nhắn ngay lập tức vào UI
    setMessage("");
  }, [message, nguoiGui, nguoiNhan, isConnected]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="bg-red-500 text-white p-4 text-lg font-semibold flex justify-between items-center">
        <span>Chat với Admin {isConnected ? "(Online)" : "(Offline)"}</span>
        <span>{userName || "Đang tải..."}</span>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto p-4">
        {messages.map(({ nguoi_gui, noi_dung }, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg text-white mb-2 ${
              nguoi_gui === nguoiGui ? "bg-red-500 ml-auto" : "bg-gray-500 mr-auto"
            }`}
          >
            <p>{noi_dung}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center p-4 bg-white shadow-lg">
        <select
          value={nguoiNhan}
          onChange={(e) => setNguoiNhan(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        >
          <option value="">-- Chọn người nhận --</option>
          {danhSachAdmin
            .filter(({ _id }) => _id !== nguoiGui)
            .map(({ _id, username }) => (
              <option key={_id} value={_id}>
                {username}
              </option>
            ))}
        </select>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border p-2 rounded-lg"
        />
        <button onClick={sendMessage} className="ml-2 bg-red-500 text-white p-2 rounded-lg">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatAdmin;