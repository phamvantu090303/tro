import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../Axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ThongKeDienNang = () => {
  const [duLieuBieuDo, setDuLieuBieuDo] = useState({
    dienNangTheoPhong: [],
    dienNangTheoNgay: [],
    dienNangTheoThang: [],
    dienNangTheoNam: [],
  });
  const [dangTai, setDangTai] = useState(true);
  const [loaiBieuDo, setLoaiBieuDo] = useState("ngay");
  const [ngayChon, setNgayChon] = useState("");
  const [thangChon, setThangChon] = useState("");
  const [namChon, setNamChon] = useState("");
  const [roomChon, setRoomChon] = useState("");
  const [danhSachPhong, setDanhSachPhong] = useState([]);

  const layDuLieuBieuDo = async () => {
    setDangTai(true);
    try {
      const params = {};
      if (loaiBieuDo === "ngay" && ngayChon) params.ngay = ngayChon;
      if (loaiBieuDo === "thang" && thangChon) params.thang = thangChon;
      if (loaiBieuDo === "nam" && namChon) params.nam = namChon;
      if (roomChon) params.room_id = roomChon;

      const phanHoi = await axiosInstance.get("/thong-ke/chart-dien-nang", { params });
      const data = phanHoi.data.data;

      const filterByRoom = (arr) => roomChon ? arr.filter(item => item.room_id === roomChon) : arr;

      setDuLieuBieuDo({
        dienNangTheoPhong: filterByRoom(data.dienNangTheoPhong || []),
        dienNangTheoNgay: filterByRoom(data.dienNangTheoNgay || []),
        dienNangTheoThang: filterByRoom(data.dienNangTheoThang || []),
        dienNangTheoNam: filterByRoom(data.dienNangTheoNam || []),
      });

      const allRooms = [
        ...new Set([
          ...(data.dienNangTheoPhong || []).map(item => item.room_id),
          ...(data.dienNangTheoNgay || []).map(item => item.room_id),
          ...(data.dienNangTheoThang || []).map(item => item.room_id),
          ...(data.dienNangTheoNam || []).map(item => item.room_id)
        ])
      ];
      setDanhSachPhong(allRooms);
    } catch (loi) {
      console.error("Lỗi khi lấy dữ liệu biểu đồ:", loi);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    layDuLieuBieuDo();
  }, [loaiBieuDo, ngayChon, thangChon, namChon, roomChon]);

  const createGradient = (ctx, chartArea) => {
    if (!chartArea) return "rgba(255, 69, 0, 0.8)";
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "rgba(255, 215, 0, 0.8)");
    gradient.addColorStop(0.5, "rgba(255, 165, 0, 0.8)");
    gradient.addColorStop(1, "rgba(255, 69, 0, 0.8)");
    return gradient;
  };

  const taoDuLieuBieuDo = (data, title, isBar = false) => {
    let labels, datasets;

    if (isBar) {
      const tongDienNangTheoPhong = data.reduce((acc, item) => {
        acc[item.room_id] = (acc[item.room_id] || 0) + (item.energy || 0);
        return acc;
      }, {});

      labels = Object.keys(tongDienNangTheoPhong).map(room => `Phòng ${room}`);
      datasets = [{
        label: "Điện năng tiêu thụ (Wh)",
        data: Object.values(tongDienNangTheoPhong),
        backgroundColor: "rgba(255, 165, 0, 0.8)",
        borderColor: "rgba(255, 69, 0, 1)",
        borderWidth: 1,
      }];
    } else {
      labels = data.map((item) => {
        const date = new Date(item.timestamp);
        return roomChon ? 
          (loaiBieuDo === "ngay" ? date.toLocaleTimeString() :
           loaiBieuDo === "thang" ? `${date.getDate()}/${date.getMonth() + 1}` :
           `${date.getMonth() + 1}/${date.getFullYear()}`) :
          (loaiBieuDo === "ngay" ? `${item.room_id} (${date.toLocaleTimeString()})` :
           loaiBieuDo === "thang" ? `${item.room_id} (${date.getDate()}/${date.getMonth() + 1})` :
           `${item.room_id} (${date.getMonth() + 1}/${date.getFullYear()})`);
      });

      datasets = [{
        label: "Điện năng tiêu thụ (Wh)",
        data: data.map((item) => item.energy || 0),
        borderColor: (context) => createGradient(context.chart.ctx, context.chart.chartArea),
        backgroundColor: "rgba(255, 69, 0, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: (context) => createGradient(context.chart.ctx, context.chart.chartArea),
        pointBorderWidth: 2,
        pointRadius: 4,
      }];
    }

    return {
      labels,
      datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: "#ffffff" } },
          title: { 
            display: true, 
            text: roomChon && !isBar ? `${title} - Phòng ${roomChon}` : title, 
            color: "#ffffff" 
          },
          tooltip: { callbacks: { label: (context) => `${context.raw} Wh` } },
        },
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { color: "#ffffff", stepSize: 10 }, 
            grid: { color: "rgba(255, 255, 255, 0.1)" }, 
            title: { display: true, text: "Điện năng (Wh)", color: "#ffffff" } 
          },
          x: { 
            ticks: { color: "#ffffff" }, 
            grid: { display: false }, 
            title: { 
              display: true, 
              text: isBar ? "Phòng" : (roomChon ? "Thời gian" : "Phòng (Thời gian)"), 
              color: "#ffffff" 
            } 
          },
        },
      },
    };
  };

  const bieuDoTheoPhong = taoDuLieuBieuDo(duLieuBieuDo.dienNangTheoPhong, "Điện Năng Theo Phòng", !roomChon);
  const bieuDoTheoNgay = taoDuLieuBieuDo(duLieuBieuDo.dienNangTheoNgay, ngayChon ? `Điện Năng Ngày ${ngayChon}` : "Điện Năng Hôm Nay");
  const bieuDoTheoThang = taoDuLieuBieuDo(duLieuBieuDo.dienNangTheoThang, thangChon ? `Điện Năng Tháng ${thangChon}` : `Điện Năng Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
  const bieuDoTheoNam = taoDuLieuBieuDo(duLieuBieuDo.dienNangTheoNam, namChon ? `Điện Năng Năm ${namChon}` : `Điện Năng Năm ${new Date().getFullYear()}`);

  if (dangTai) return <div className="text-center text-white text-xl py-10">Đang tải dữ liệu...</div>;

  const bieuDoHienTai = () => {
    switch (loaiBieuDo) {
      case "phong": 
        return roomChon ? 
          <Line data={bieuDoTheoPhong} options={bieuDoTheoPhong.options} /> : 
          <Bar data={bieuDoTheoPhong} options={bieuDoTheoPhong.options} />;
      case "ngay": 
        return duLieuBieuDo.dienNangTheoNgay.length ? 
          <Line data={bieuDoTheoNgay} options={bieuDoTheoNgay.options} /> : 
          <p className="text-white">Không có dữ liệu cho ngày {ngayChon || "hôm nay"}</p>;
      case "thang": 
        return duLieuBieuDo.dienNangTheoThang.length ? 
          <Line data={bieuDoTheoThang} options={bieuDoTheoThang.options} /> : 
          <p className="text-white">Không có dữ liệu cho tháng {thangChon || `${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</p>;
      case "nam": 
        return duLieuBieuDo.dienNangTheoNam.length ? 
          <Line data={bieuDoTheoNam} options={bieuDoTheoNam.options} /> : 
          <p className="text-white">Không có dữ liệu cho năm {namChon || new Date().getFullYear()}</p>;
      default: 
        return <Line data={bieuDoTheoNgay} options={bieuDoTheoNgay.options} />;
    }
  };

  const chiTietDienNang = () => {
    const data = {
      "phong": duLieuBieuDo.dienNangTheoPhong,
      "ngay": duLieuBieuDo.dienNangTheoNgay,
      "thang": duLieuBieuDo.dienNangTheoThang,
      "nam": duLieuBieuDo.dienNangTheoNam
    }[loaiBieuDo] || duLieuBieuDo.dienNangTheoNgay;

    return data.length ? (
      <div className="border border-gray-500 rounded-lg max-h-[300px] overflow-auto">
        {/* Tiêu đề bảng */}
        <div className="grid grid-cols-4 gap-5 mb-5 bg-gray-300 rounded-t-lg py-2 px-5 text-black">
          <p className="text-lg font-medium">Phòng</p>
          <p className="text-lg font-medium">Năng lượng (Wh)</p>
          <p className="text-lg font-medium">Tổng chi phí (đ)</p>
          <p className="text-lg font-medium">Thời gian</p>
        </div>
        {/* Dữ liệu */}
        {data.map((item, index) => (
          <div 
            key={`${item.room_id}-${item.timestamp}-${index}`} 
            className="grid grid-cols-4 gap-5 py-2 px-5 border-b border-gray-700"
          >
            <p>{item.room_id}</p>
            <p>{(item.energy || 0).toFixed(2)}</p>
            <p>{(item.total_cost || 0).toFixed(2)}</p>
            <p>{new Date(item.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400">Không có dữ liệu chi tiết để hiển thị.</p>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Thống Kê Điện Năng</h2>

      <div className="flex gap-4 mb-6">
        {["ngay", "thang", "nam"].map((type) => (
          <button
            key={type}
            onClick={() => setLoaiBieuDo(type)}
            className={`px-4 py-2 rounded-md transition-colors ${
              loaiBieuDo === type 
                ? "bg-orange-500 text-white" 
                : "bg-white text-black hover:bg-orange-100"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={roomChon}
          onChange={(e) => setRoomChon(e.target.value)}
          className="px-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {danhSachPhong.map((room) => (
            <option key={room} value={room}>
              Phòng {room}
            </option>
          ))}
        </select>

        {loaiBieuDo === "ngay" && (
          <input
            type="date"
            value={ngayChon}
            onChange={(e) => setNgayChon(e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        )}
        {loaiBieuDo === "thang" && (
          <input
            type="month"
            value={thangChon}
            onChange={(e) => setThangChon(e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        )}
        {loaiBieuDo === "nam" && (
          <input
            type="number"
            value={namChon}
            onChange={(e) => setNamChon(e.target.value)}
            placeholder="Nhập năm"
            className="px-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-40"
          />
        )}
      </div>

      <div className="flex gap-6">
        <div className="w-2/5 overflow-y-auto max-h-[400px] pr-4">
          <h3 className="text-lg font-semibold mb-4">Chi tiết điện năng</h3>
          {chiTietDienNang()}
        </div>
        <div className="w-3/5 h-[400px]">
          {bieuDoHienTai()}
        </div>
      </div>
    </div>
  );
};

export default ThongKeDienNang;