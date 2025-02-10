import  nodemailer from 'nodemailer';
import { Request, Response } from "express";
import PhongTroModel from "../models/PhongTroModel";
import HoaDonThanhToanModel from "../models/HoaDonThanhToanModel";
import dotenv from 'dotenv';
dotenv.config();

export const CreateHoaDon = async (req: Request, res: Response) => {
    try {
     const {user}:any= req;
     const {ma_phong,} = req.body;
     const data = await PhongTroModel.findOne({ma_phong:ma_phong})
     if(!data) return res.status(404).json({message:"Phòng không tồn tại"})
     const hoadon = { 
        ma_phong: data.ma_phong,
        id_users: user._id,
        so_tien: data.gia_tien,
        noi_dung:"thanh toán tiền phòng",
        ma_don_hang: "HD"+Math.floor(Math.random() * 1000000),
        ngay_chuyen_khoan: new Date(),
        trang_thai: "Chưa thanh toán"
     }
     const newHoaDon = new HoaDonThanhToanModel(hoadon)
        await newHoaDon.save()
        await sendEmail(user, newHoaDon);
        res.status(201).json(newHoaDon)
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}
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
        text: `Chào ${user.username},\n\nDưới đây là thông tin hóa đơn đặt cọc của bạn:\n
        - Mã phòng: ${hoadon.ma_phong}
        - Mã đơn hàng: ${hoadon.ma_don_hang}
        - Số tiền: ${hoadon.so_tien} VND
        - Nội dung: ${hoadon.noi_dung}
        - Trạng thái: ${hoadon.trang_thai}
    
        📋 Thông tin tài khoản thanh toán:
        - Chủ tài khoản: Nguyễn Văn A
        - Ngân hàng: Vietcombank
        - Số tài khoản: 1234 5678 9012 3456
    
        📄 Xem hợp đồng thuê trọ của bạn tại đây:
         ${hopdonglink}

        💡 Vui lòng chuyển khoản đúng nội dung và số tiền trên để xác nhận thanh toán.
    
        Trân trọng!`,
    };
    

    await transporter.sendMail(mailOptions);
};