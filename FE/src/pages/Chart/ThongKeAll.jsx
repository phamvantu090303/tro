import React, { useState } from "react";
import ThongKeYeuThich from "../../pages/Chart/thongKeYeuThich";
import ThongKeDanhGia from "../../pages/Chart/thongKeDanhGia";
import ThongKeDienNang from "../../pages/Chart/thongKeDienNang";

const ThongKe = () => {
  const [trangHienThi, setTrangHienThi] = useState("yeuThich");

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", backgroundColor: "#1a1a2e", color: "#ffffff" }}>
      <h1>Thống Kê</h1>
      <div style={{ marginBottom: "20px" }}>
        <select
          onChange={(e) => setTrangHienThi(e.target.value)}
          value={trangHienThi}
          style={{
            border: "1px solid #d1d5db", // border-gray-300
            backgroundColor: "#ffffff", // bg-white
            padding: "10px 12px", // px-3 py-3
            borderRadius: "5px", // rounded-lg
            width: "20%", // w-[60%]
            color: "#000000", // Màu chữ đen cho select
            cursor: "pointer",
          }}
        >
          <option value="">Chọn thống kê</option>
          <option value="yeuThich">Thống Kê Yêu thích</option>
          <option value="danhGia">Thống Kê Đánh giá</option>
          <option value="dienNang">Thống Kê Điên năng</option>
        </select>
      </div>

      <div>
        {trangHienThi === "yeuThich" ? <ThongKeYeuThich /> : trangHienThi === "danhGia" ? <ThongKeDanhGia /> : <ThongKeDienNang />}
      </div>
    </div>
  );
};

export default ThongKe;