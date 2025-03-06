import nodemailer from "nodemailer";
import { Request, Response } from "express";
import PhongTroModel from "../models/PhongTroModel";
import HoaDonThanhToanModel from "../models/HoaDonThanhToanModel";
import dotenv from "dotenv";
dotenv.config();

export const CreateHoaDon = async (req: Request, res: Response) => {
  try {
    const { user }: any = req;
    const { ma_phong } = req.body;
    const data = await PhongTroModel.findOne({ ma_phong: ma_phong });
    if (!data) return res.status(404).json({ message: "Phòng không tồn tại" });
    const hoadon = {
      ma_phong: data.ma_phong,
      id_users: user._id,
      so_tien: data.gia_tien,
      noi_dung: "thanh toán tiền phòng",
      ma_don_hang: "HD" + Math.floor(Math.random() * 1000000),
      ngay_chuyen_khoan: new Date(),
      trang_thai: "Chưa thanh toán",
    };
    const newHoaDon = new HoaDonThanhToanModel(hoadon);
    await newHoaDon.save();
    await sendEmail(user, newHoaDon);
    res.status(201).json(newHoaDon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const sendEmail = async (user: any, hoadon: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const hopdonglink = `${process.env.CLIENT_URL}/hopdong/${hoadon.ma_phong}`;
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: user.email,
    subject: "Hóa Đơn Thuê Trọ",
    html: `
      <div style="max-width:600px;margin:auto;padding:20px;font-family:'Arial',sans-serif;border:1px solid #ddd;border-radius:10px;background-color:#f9f9f9;">
        <!-- Logo -->
        <div style="text-align:center;margin-bottom:20px;">
          <img src="https://your-logo-url.com/logo.png" alt="Logo" style="width:120px;">
        </div>

        <h2 style="text-align:center;color:#333;">📄 HÓA ĐƠN ĐẶT CỌC</h2>
        <p>Chào <b>${user.username}</b>, chúng tôi đã nhận được đơn đặt cọc phòng của bạn.</p>

        <!-- Thông tin hóa đơn -->
        <div style="background:#fff;padding:15px;border-radius:8px;box-shadow:0px 2px 5px rgba(0,0,0,0.1);">
          <p><strong>🏠 Mã phòng:</strong> ${hoadon.ma_phong}</p>
          <p><strong>📌 Mã đơn hàng:</strong> ${hoadon.ma_don_hang}</p>
          <p><strong>💰 Số tiền:</strong> <span style="color:#27ae60;font-weight:bold;">${hoadon.so_tien} VND</span></p>
          <p><strong>📝 Nội dung:</strong> ${hoadon.noi_dung}</p>
          <p><strong>⚠️ Trạng thái:</strong> <span style="color:red;font-weight:bold;">${hoadon.trang_thai}</span></p>
        </div>

        <!-- Thông tin tài khoản thanh toán -->
        <div style="margin-top:20px;padding:15px;background:#fff;border-radius:8px;box-shadow:0px 2px 5px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom:10px;color:#2c3e50;">📌 Thông tin tài khoản thanh toán:</h3>
          <p><strong>👤 Chủ tài khoản:</strong> Nguyễn Văn A</p>
          <p><strong>🏦 Ngân hàng:</strong> Vietcombank</p>
          <p><strong>🔢 Số tài khoản:</strong> 1234 5678 9012 3456</p>
        </div>

        <!-- Link hợp đồng -->
        <div style="text-align:center;margin-top:20px;">
          <a href="${hopdonglink}" style="display:inline-block;padding:10px 20px;background:#3498db;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;">
            📜 Xem hợp đồng của bạn
          </a>
        </div>

        <p style="margin-top:20px;text-align:center;color:#777;font-size:12px;">©DZFullStack | <a href="#" style="color:gray;">Hủy đăng ký</a></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
