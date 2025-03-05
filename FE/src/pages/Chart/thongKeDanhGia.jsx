import React, { useEffect, useState } from "react";
import { axiosInstance } from '../../../Axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ThongKeDanhGia = () => {
    const [duLieuBieuDo, setDuLieuBieuDo] = useState({
        danhGiaTheoPhong: [],
        danhGiaTheoNgay: [],
        danhGiaTheoThang: [],
        danhGiaTheoNam: [],
    });
    const [dangTai, setDangTai] = useState(true);
    const [loaiBieuDo, setLoaiBieuDo] = useState("phong");
    const [ngayChon, setNgayChon] = useState("");
    const [thangChon, setThangChon] = useState("");
    const [namChon, setNamChon] = useState("");

    const layDuLieuBieuDo = async () => {
        setDangTai(true);
        try {
            const params = {};
            if (loaiBieuDo === "ngay" && ngayChon) params.ngay = ngayChon;
            if (loaiBieuDo === "thang" && thangChon) params.thang = thangChon;
            if (loaiBieuDo === "nam" && namChon) params.nam = namChon;

            const phanHoi = await axiosInstance.get('/thong-ke/chart-danh-gia', { params });
            setDuLieuBieuDo({
                danhGiaTheoPhong: phanHoi.data.data.danhGiaTheoPhong || [],
                danhGiaTheoNgay: phanHoi.data.data.danhGiaTheoNgay || [],
                danhGiaTheoThang: phanHoi.data.data.danhGiaTheoThang || [],
                danhGiaTheoNam: phanHoi.data.data.danhGiaTheoNam || [],
            });
        } catch (loi) {
            console.error("Lỗi khi lấy dữ liệu biểu đồ:", loi);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        layDuLieuBieuDo();
    }, [ngayChon, thangChon, namChon]); // Chỉ gọi khi thay đổi giá trị chọn

    useEffect(() => {
        if (loaiBieuDo === "phong") layDuLieuBieuDo(); // Gọi khi chuyển về "Tổng quan"
    }, [loaiBieuDo]);

    const createGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(173, 216, 230, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 191, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 255, 0.8)');
        return gradient;
    };

    const taoDuLieuBieuDo = (data, title) => ({
        labels: data.map((item) => item.tenPhong || item.maPhong),
        datasets: [
            {
                label: "Số lượt Đánh Giá",
                data: data.map((item) => item.soLuotDanhGia || 0),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                borderWidth: 0,
            },
        ],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: title, color: "#ffffff" },
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: "#ffffff", stepSize: 1 }, grid: { color: "rgba(255, 255, 255, 0.1)" } },
                x: { ticks: { color: "#ffffff" }, grid: { display: false } },
            },
        },
    });

    const bieuDoTheoPhong = taoDuLieuBieuDo(duLieuBieuDo.danhGiaTheoPhong, "Top 10 Phòng Được Yêu Thích Nhất");
    const bieuDoTheoNgay = taoDuLieuBieuDo(
        duLieuBieuDo.danhGiaTheoNgay,
        ngayChon ? `Top 5 Phòng Yêu Thích Nhất Ngày ${ngayChon}` : "Top 5 Phòng Yêu Thích Nhất Hôm Nay"
    );
    const bieuDoTheoThang = taoDuLieuBieuDo(
        duLieuBieuDo.danhGiaTheoThang,
        thangChon ? `Top 5 Phòng Yêu Thích Nhất Tháng ${thangChon}` : `Top 5 Phòng Yêu Thích Nhất Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`
    );
    const bieuDoTheoNam = taoDuLieuBieuDo(
        duLieuBieuDo.danhGiaTheoNam,
        namChon ? `Top 5 Phòng Yêu Thích Nhất Năm ${namChon}` : `Top 5 Phòng Yêu Thích Nhất Năm ${new Date().getFullYear()}`
    );

    if (dangTai) return <div>Đang tải dữ liệu...</div>;

    const chonBieuDo = (loai) => {
        setLoaiBieuDo(loai);
        if (loai !== "ngay") setNgayChon("");
        if (loai !== "thang") setThangChon("");
        if (loai !== "nam") setNamChon("");
    };

    const bieuDoHienTai = () => {
        switch (loaiBieuDo) {
            case "phong":
                return <Bar data={bieuDoTheoPhong} options={bieuDoTheoPhong.options} />;
            case "ngay":
                return duLieuBieuDo.danhGiaTheoNgay.length ? (
                    <Bar data={bieuDoTheoNgay} options={bieuDoTheoNgay.options} />
                ) : (
                    <p>Không có dữ liệu cho ngày {ngayChon || "hôm nay"}</p>
                );
            case "thang":
                return duLieuBieuDo.danhGiaTheoThang.length ? (
                    <Bar data={bieuDoTheoThang} options={bieuDoTheoThang.options} />
                ) : (
                    <p>Không có dữ liệu cho tháng {thangChon || `${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</p>
                );
            case "nam":
                return duLieuBieuDo.danhGiaTheoNam.length ? (
                    <Bar data={bieuDoTheoNam} options={bieuDoTheoNam.options} />
                ) : (
                    <p>Không có dữ liệu cho năm {namChon || new Date().getFullYear()}</p>
                );
            default:
                return <Bar data={bieuDoTheoPhong} options={bieuDoTheoPhong.options} />;
        }
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", backgroundColor: "#1a1a2e", color: "#ffffff" }}>
            <h2>Thống kê đánh giá</h2>

            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => chonBieuDo("phong")}
                    style={{
                        marginRight: "10px",
                        padding: "10px 20px",
                        backgroundColor: loaiBieuDo === "phong" ? "#ff4500" : "#ffffff",
                        color: loaiBieuDo === "phong" ? "#ffffff" : "#000000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Tổng quan
                </button>
                <button
                    onClick={() => chonBieuDo("ngay")}
                    style={{
                        marginRight: "10px",
                        padding: "10px 20px",
                        backgroundColor: loaiBieuDo === "ngay" ? "#ff4500" : "#ffffff",
                        color: loaiBieuDo === "ngay" ? "#ffffff" : "#000000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Ngày
                </button>
                <button
                    onClick={() => chonBieuDo("thang")}
                    style={{
                        marginRight: "10px",
                        padding: "10px 20px",
                        backgroundColor: loaiBieuDo === "thang" ? "#ff4500" : "#ffffff",
                        color: loaiBieuDo === "thang" ? "#ffffff" : "#000000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Tháng
                </button>
                <button
                    onClick={() => chonBieuDo("nam")}
                    style={{
                        marginRight: "10px",
                        padding: "10px 20px",
                        backgroundColor: loaiBieuDo === "nam" ? "#ff4500" : "#ffffff",
                        color: loaiBieuDo === "nam" ? "#ffffff" : "#000000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Năm
                </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                {loaiBieuDo === "ngay" && (
                    <input
                        type="date"
                        value={ngayChon}
                        onChange={(e) => setNgayChon(e.target.value)}
                        style={{ padding: "10px", borderRadius: "5px", border: "none" }}
                    />
                )}
                {loaiBieuDo === "thang" && (
                    <input
                        type="month"
                        value={thangChon}
                        onChange={(e) => setThangChon(e.target.value)}
                        style={{ padding: "10px", borderRadius: "5px", border: "none" }}
                    />
                )}
                {loaiBieuDo === "nam" && (
                    <input
                        type="month"
                        value={namChon}
                        onChange={(e) => setNamChon(e.target.value)}
                        style={{ padding: "10px", borderRadius: "5px", border: "none", width: "150px" }}
                    />
                )}
            </div>

            <div style={{ height: "400px" }}>
                {bieuDoHienTai()}
            </div>
        </div>
    );
};

export default ThongKeDanhGia;