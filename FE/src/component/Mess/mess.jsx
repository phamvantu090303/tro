import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { axiosInstance } from "../../../Axios";
import { FaPaperPlane } from "react-icons/fa";

const token = localStorage.getItem("token");
const socket = io("http://localhost:5000", {
  auth: { Authorization: `Bearer ${token}` },
});

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nguoiNhan, setNguoiNhan] = useState("");
  const [nguoiGui, setNguoiGui] = useState("");
  const [userName, setUserName] = useState("");
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState([]);

  // get thông tin user
  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .then(({ data }) => {
        setNguoiGui(data.data._id);
        setUserName(data.data.username);
      })
      .catch((error) => console.error("Lỗi lấy thông tin người dùng:", error));
  }, []);

  // get thông tin danh sách người dùng
  useEffect(() => {
    axiosInstance
      .get("/admin/AllAdmin")
      .then(({ data }) => setDanhSachNguoiDung(data.data))
      .catch((error) => console.error("Lỗi lấy danh sách người dùng:", error));
  }, []);

  // get thông tin tin nhắn giữa người gửi và người nhận
  useEffect(() => {
    if (!nguoiGui || !nguoiNhan) return;

    axiosInstance
      .get(`/tin-nhan/mess/${nguoiNhan}`)
      .then(({ data }) => setMessages(data.data))
      .catch((error) => console.error("Lỗi lấy tin nhắn:", error));
  }, [nguoiGui, nguoiNhan]);

  // Lắng nghe tin nhắn mới từ socket
  useEffect(() => {
    if (!nguoiGui || !nguoiNhan) return;

    const handleReceiveMessage = ({ payload }) => {
      if ([payload.nguoi_gui, payload.nguoi_nhan].includes(nguoiGui)) {
        setMessages((prev) => [...prev, payload]);
      }
    };

    socket.on("nhan_tin_nhan", handleReceiveMessage);
    return () => socket.off("nhan_tin_nhan", handleReceiveMessage);
  }, [nguoiGui, nguoiNhan]);

  // Gửi tin nhắn
  const sendMessage = useCallback(() => {
    if (!message.trim() || !nguoiNhan) {
      alert("Vui lòng nhập tin nhắn và chọn người nhận!");
      return;
    }

    const newMessage = { nguoi_gui: nguoiGui, nguoi_nhan: nguoiNhan, noi_dung: message };
    socket.emit("gui_tin_nhan", { payload: newMessage });
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  }, [message, nguoiGui, nguoiNhan]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="bg-blue-500 text-white p-4 text-lg font-semibold flex justify-between items-center">
        <span>Chat</span>
        <span>{userName || "Đang tải..."}</span>
      </div>

      {/* Hiển thị tin nhắn */}
      <div className="flex flex-col flex-1 overflow-y-auto p-4">
        {messages.map(({ nguoi_gui, noi_dung }, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg text-white mb-2 ${
              nguoi_gui === nguoiGui ? "bg-blue-500 ml-auto" : "bg-gray-500 mr-auto"
            }`}
          >
            <p>{noi_dung}</p>
          </div>
        ))}
      </div>

      {/* Chọn người nhận */}
      <div className="flex items-center p-4 bg-white shadow-lg">
        <select value={nguoiNhan} onChange={(e) => setNguoiNhan(e.target.value)} className="border p-2 rounded-lg mr-2">
          <option value="">-- Chọn người nhận --</option>
          {danhSachNguoiDung.filter(({ _id }) => _id !== nguoiGui).map(({ _id, username }) => (
            <option key={_id} value={_id}>{username}</option>
          ))}
        </select>

        {/* Nhập tin nhắn */}
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..."
          className="flex-1 border p-2 rounded-lg" />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
