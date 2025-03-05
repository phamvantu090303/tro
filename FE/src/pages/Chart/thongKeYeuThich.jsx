import React, { useEffect, useState } from "react";
import { axiosInstance } from '../../../Axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ThongKeYeuThich = () => {
  const [duLieuBieuDo, setDuLieuBieuDo] = useState({
    yeuThichTheoPhong: [],
  });
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const layDuLieuBieuDo = async () => {
      try {
        const phanHoi = await axiosInstance.get('/yeu-thich/chart-data');
        // Lấy trực tiếp từ phanHoi.data thay vì phanHoi.data.data
        setDuLieuBieuDo({
          yeuThichTheoPhong: phanHoi.data.data.yeuThichTheoPhong || [],
        });
        setDangTai(false);
      } catch (loi) {
        console.error("Lỗi khi lấy dữ liệu biểu đồ:", loi);
        setDangTai(false);
      }
    };

    layDuLieuBieuDo();
  }, []);

  // Tạo gradient màu dựa trên số lượng phòng
  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)'); // Vàng nhạt cho phòng đầu
    gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.8)'); // Cam cho giữa
    gradient.addColorStop(1, 'rgba(255, 69, 0, 0.8)'); // Đỏ đậm cho phòng cuối
    return gradient;
  };

  // Dữ liệu và cấu hình cho Bar Chart (Yêu thích theo phòng)
  const duLieuBieuDoCot = {
    labels: duLieuBieuDo.yeuThichTheoPhong.map((item) => item.tenPhong || item.maPhong), // Sử dụng tenPhong từ API
    datasets: [
      {
        label: "Số lượt yêu thích",
        data: duLieuBieuDo.yeuThichTheoPhong.map((item) => item.soLuotYeuThich || 0), // Dữ liệu từ API
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return createGradient(ctx, chartArea);
        },
        borderWidth: 0, // Không có viền
      },
    ],
  };

  const tuyChonBieuDoCot = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn chú thích
      },
      title: {
        display: true,
        text: "Top 10 Phòng Được Yêu Thích Nhất",
        color: "#ffffff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50, // Giới hạn trục Y điều chỉnh dựa trên dữ liệu thực tế
        ticks: {
          color: "#ffffff", // Màu trắng cho nhãn trục Y
          stepSize: 1, // Bước nhảy 500
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Đường lưới mờ
        },
      },
      x: {
        ticks: {
          color: "#ffffff", // Màu trắng cho nhãn trục X
        },
        grid: {
          display: false, // Ẩn lưới trục X
        },
      },
    },
  };

  if (dangTai) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", backgroundColor: "#1a1a2e", color: "#ffffff" }}>
      <h2>Thống kê theo phòng</h2>
      <div style={{ height: "400px" }}>
        <Bar data={duLieuBieuDoCot} options={tuyChonBieuDoCot} />
      </div>
    </div>
  );
};

export default ThongKeYeuThich;