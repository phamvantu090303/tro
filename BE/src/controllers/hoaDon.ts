import { HoaDonService } from "./../services/HoaDonService";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import PhongTroModel from "../models/PhongTroModel";
import HoaDonThanhToanModel from "../models/HoaDonThanhToanModel";
import dotenv from "dotenv";
dotenv.config();

const hoaDonService = new HoaDonService();

export const CreateHoaDon = async (req: Request, res: Response) => {
  try {
    const { user }: any = req;
    const { ma_phong } = req.body;
    const check = await PhongTroModel.findOne({ id_users: user._id });
    if (check) {
      return res.status(400).json({ message: "Bạn đã thuê phòng rồi" });
    } else {
      const data = await PhongTroModel.findOne({ ma_phong: ma_phong });
      if (!data)
        return res.status(404).json({ message: "Phòng không tồn tại" });
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
    }
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
    <div style="max-width: 600px; margin: 20px auto; padding: 25px; font-family: 'Arial', sans-serif; border: 1px solid #e0e0e0; border-radius: 12px; background: linear-gradient(135deg, #ffffff, #f5f7fa); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  <!-- Logo -->
  <div style="text-align: center; margin-bottom: 25px;">
    <img src="../../../FE/src/assets/logo/Logo.svg" alt="Logo" style="width: 100px; max-width: 100%; height: auto;">
  </div>

  <!-- Tiêu đề -->
  <h2 style="text-align: center; color: #2c3e50; font-size: 24px; margin-bottom: 20px;">📄 HÓA ĐƠN ĐẶT CỌC</h2>
  <p style="text-align: center; color: #555; font-size: 16px; margin-bottom: 25px;">Chào <b>${user.username}</b>, chúng tôi đã nhận được đơn đặt cọc phòng của bạn.</p>

  <!-- Nội dung hóa đơn mới (dựa trên hình ảnh) -->
  <div style="background: #fff; padding: 20px; border-left: 5px solid #e91e63; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="font-size: 16px; color: #333; margin-right:10px;">Mã đơn hàng:</h3>
      <p style="font-size: 16px; color: #666;">${hoadon.ma_don_hang}</p>  
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="font-size: 16px; color: #333; margin-right:10px;">Người nhận:</h3>
      <p style="font-size: 16px; color: #666;">${user.username}</p>
    </div>
   
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="font-size: 16px; color: #333; margin-right:10px;">Số tiền đặt cọc:</h3>
      <p style="font-size: 16px; color: #666;">${hoadon.so_tien} VND</p>
    </div>   
     <!-- Thông tin thanh toán -->
    <div style="display: flex; justify-content: space-between; font-size: 13px; color: #555; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
      <div>
        <h4 style="font-size: 16px; color: #333; margin-bottom: 8px;">Thông tin thanh toán</h4>
        <p style="margin: 5px 0; width: 50%;">Vui lòng thanh toán trong vòng 15 ngày kể từ ngày nhận hóa đơn.</p>
      </div>
      <div style="width:50%">
        <h4 style="font-size: 16px; color: #333; margin-bottom: 8px;">Chi tiết ngân hàng</h4>
        <p style="margin: 5px 0;"><strong>Tên ngân hàng:</strong> Vietcombank</p>
        <p style="margin: 5px 0;"><strong>Mã Swift:</strong> ABCDEFGH</p>
        <p style="margin: 5px 0;"><strong>Số tài khoản:</strong> 1234 5678 9012 3456</p>
      </div>
    </div>
      <div style="text-align: center; margin-top: 25px;">
        <a href="${hopdonglink}" style="display: inline-block; padding: 12px 25px; background: #3498db; color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; transition: background 0.3s ease;">📜 Xem hợp đồng của bạn</a>
      </div>
    </div>
</div>

<!-- CSS Responsive -->
<style>
  @media (max-width: 480px) {
    div[style*="max-width: 600px"] {
      padding: 15px;
      margin: 10px;
    }
    h2 {
      font-size: 20px;
    }
    p, a {
      font-size: 14px !important;
    }
    img {
      width: 80px;
    }
    a[style*="display: inline-block"] {
      padding: 10px 20px;
    }
    div[style*="display: flex; justify-content: space-between"] {
      flex-direction: column;
    }
    div[style*="display: flex; justify-content: space-between"] > div {
      width: 100% !important;
      margin-bottom: 15px;
    }
    table th, table td {
      font-size: 12px;
      padding: 8px;
    }
  }
</style>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const getAllHoaDon = async (req: Request, res: Response) => {
  try {
    const hoadon = await hoaDonService.getAll();
    if (!hoadon || hoadon.length === 0)
      return res.status(404).json({ message: "Không có hóa đơn nào" });
    res.status(200).json({
      status: "200",
      data: hoadon,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHoadon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hoadon = await HoaDonThanhToanModel.findByIdAndDelete(id);
    if (!hoadon)
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    res.status(200).json({ message: "Xóa hóa đơn thành công" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const DetaijHoaDon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hoadon = await hoaDonService.getById(id);
    if (!hoadon)
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    res.status(200).json(hoadon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
