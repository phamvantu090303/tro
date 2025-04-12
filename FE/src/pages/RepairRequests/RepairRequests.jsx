import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_BASE_URL = "https://bephongtro.hoclaptrinhiz.com/sua_chua"; // Đổi thành đường dẫn thực tế của bạn

const RepairRequests = () => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ userName: "", ma_phong: "", issue: "", status: "Chờ xử lý", approved: "Chưa phê duyệt" });

  // Lấy danh sách yêu cầu sửa chữa từ API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/GetAll`, { withCredentials: true })
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Lỗi tải dữ liệu:", err));
  }, []);

  // Thêm yêu cầu mới
  const handleAddRequest = () => {
    if (!newRequest.userName.trim() || !newRequest.ma_phong.trim() || !newRequest.issue.trim()) return;

    axios.post(`${API_BASE_URL}/Create`, newRequest, { withCredentials: true })
      .then((res) => {
        setRequests([...requests, res.data]); // Cập nhật danh sách
        setNewRequest({ userName: "", ma_phong: "", issue: "", status: "Chờ xử lý", approved: "Chưa phê duyệt" });
      })
      .catch((err) => console.error("Lỗi thêm yêu cầu:", err));
  };

  // Xóa yêu cầu
  const handleDeleteRequest = (id) => {
    axios.delete(`${API_BASE_URL}/Delete/${id}`, { withCredentials: true })
      .then(() => setRequests(requests.filter((req) => req._id !== id)))
      .catch((err) => console.error("Lỗi xóa yêu cầu:", err));
  };

  // Cập nhật trạng thái
  const handleUpdateStatus = (id) => {
    axios.get(`${API_BASE_URL}/UpdateStatus/${id}`, { withCredentials: true })
      .then((res) => {
        setRequests(requests.map(req => req._id === id ? { ...req, status: res.data.status } : req));
      })
      .catch((err) => console.error("Lỗi cập nhật trạng thái:", err));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">DANH SÁCH YÊU CẦU SỬA CHỮA</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Thêm Yêu Cầu */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Thêm Yêu Cầu</h3>
          <input
            type="text"
            placeholder="Nhập tên người thuê"
            className="w-full p-2 border rounded mb-3"
            value={newRequest.userName}
            onChange={(e) => setNewRequest({ ...newRequest, userName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nhập mã phòng"
            className="w-full p-2 border rounded mb-3"
            value={newRequest.ma_phong}
            onChange={(e) => setNewRequest({ ...newRequest, ma_phong: e.target.value })}
          />
          <textarea
            placeholder="Nhập mô tả sự cố"
            className="w-full p-2 border rounded mb-3"
            value={newRequest.issue}
            onChange={(e) => setNewRequest({ ...newRequest, issue: e.target.value })}
          ></textarea>
          <button onClick={handleAddRequest} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all">
            Thêm Yêu Cầu
          </button>
        </div>

        {/* Bảng Danh Sách Yêu Cầu */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Danh Sách Yêu Cầu</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Tên Người Thuê</th>
                <th className="border p-2">Mã Phòng</th>
                <th className="border p-2">Sự Cố</th>
                <th className="border p-2">Trạng Thái</th>
                <th className="border p-2">Phê Duyệt</th>
                <th className="border p-2">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{req.userName}</td>
                  <td className="border p-2">{req.ma_phong}</td>
                  <td className="border p-2">{req.issue}</td>
                  <td className="border p-2">
                    <button 
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        req.status === "Chờ xử lý" ? "bg-yellow-500 text-black" :
                        req.status === "Đang xử lý" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                      }`}
                      onClick={() => handleUpdateStatus(req._id)}
                    >
                      {req.status}
                    </button>
                  </td>
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        req.approved === "Chưa phê duyệt" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      {req.approved}
                    </span>
                  </td>
                  <td className="border p-2 flex justify-center space-x-2">
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteRequest(req._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepairRequests;
