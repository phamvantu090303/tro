import { useState, useEffect } from "react";
import axios from "axios";

const RepairRequests = () => {
  const [repairs, setRepairs] = useState([]);
  const [newRequest, setNewRequest] = useState({ user: "", room: "", issue: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/repairs").then((res) => setRepairs(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/repairs", newRequest);
    setRepairs([...repairs, newRequest]);
    setNewRequest({ user: "", room: "", issue: "" });
  };

  const updateStatus = async (id, newStatus) => {
    await axios.put(`http://localhost:5000/repairs/${id}`, { status: newStatus });
    setRepairs(repairs.map((r) => (r._id === id ? { ...r, status: newStatus } : r)));
  };

  return (
    <div>
      <h2>Yêu Cầu Sửa Chữa</h2>

      {/* Form gửi yêu cầu */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Tên bạn" value={newRequest.user} 
          onChange={(e) => setNewRequest({ ...newRequest, user: e.target.value })} required />
        <input type="text" placeholder="Phòng trọ" value={newRequest.room} 
          onChange={(e) => setNewRequest({ ...newRequest, room: e.target.value })} required />
        <textarea placeholder="Mô tả sự cố" value={newRequest.issue} 
          onChange={(e) => setNewRequest({ ...newRequest, issue: e.target.value })} required></textarea>
        <button type="submit">Gửi yêu cầu</button>
      </form>

      {/* Danh sách yêu cầu */}
      <h3>Danh sách yêu cầu:</h3>
      <ul>
        {repairs.map((repair) => (
          <li key={repair._id}>
            <strong>{repair.user} - Phòng {repair.room}</strong> <br />
            {repair.issue} <br />
            Trạng thái: {repair.status}
            <button onClick={() => updateStatus(repair._id, "Đang xử lý")}>Đang xử lý</button>
            <button onClick={() => updateStatus(repair._id, "Hoàn thành")}>Hoàn thành</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepairRequests;
