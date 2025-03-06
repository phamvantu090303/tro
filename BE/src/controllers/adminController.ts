import { Request, Response } from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { AdminService } from "../services/AdminServiec";

dotenv.config();

const adminService = new AdminService();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { admin } = req as any;
     
        const token = await adminService.loginAdminService(admin._id, admin.verify);

        return res.json({
            message: "Login thành công!",
            data: {
                token,
                admin: {
                    id_quyen: admin.id_quyen,
                    email: admin.email,
                    username: admin.username,
                    hovaten: admin.ho_va_ten,
                    ngaysinh: admin.ngay_sinh,
                    sdt: admin.so_dien_thoai,
                    gioi_tinh: admin.gioi_tinh,
                    cccd: admin.cccd,
                    is_block: admin.is_block,
                },
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi đăng nhập.",
            error: error.message,
        });
    }
};


export const createAdmin = async (req: Request, res: Response) => {
    try {
        const data = req.body;
     
        await adminService.createAdminService(data);

        res.status(200).json({
            message: 'Admin đã được tạo thành công',
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
}

export const updateAdmin = async (req: Request, res: Response) => {

    try {
        const { admin } = req as any;
        const data = req.body;
     
        await adminService.updateAdminService(admin._id, data);

        res.status(200).json({
            message: 'Admin đã được cập nhật thành công'
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
}

export const deleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
     
        await adminService.deleteAdminService({ id });

        res.status(200).json({
            message: "Đã xóa Admin thành công!"
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
}

export const sendPasswordAdmin = async (req: Request, res: Response) => {
    try {
        const { admin } = req as any;
     
        const result = await adminService.forgotPasswordAdminService(admin._id, admin.verify);
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: admin.email,
            subject: "Xác thực tài khoản của bạn để đổi mật khẩu",
            text: `Chào ${admin.username}, vui lòng xác thực tài khoản của bạn bằng cách nhấp vào liên kết sau: ${process.env.CLIENT_ORIGIN}/admin/reset-password?token=${result}`,
        };
        // Gửi email
        await transporter.sendMail(mailOptions);
        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi gửi mail.",
            error: error.message,
        });
    }
}

export const resetPasswordAdmin = async (req: Request, res: Response) => {
    try {
        const { admin } = req as any;
        const { New_password, confirm_Password } = req.body;
     

        if (New_password !== confirm_Password) {
            return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
        }
        const result = await adminService.ResetPassWordAdminService(admin._id, New_password);
        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi đổi mật khẩu.",
            error: error.message,
        });
    }
}

export const getAdmin = async (req: any, res: any) => {
    try {
        const admin = req.admin;

        if (!admin) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        const data = await adminService.getAdmin(admin._id);

        res.status(200).json({
            status: 200,
            data: data,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Lỗi khi lấy thông tin người dùng.',
            error: error.message,
        });
    }
};


export const getAllAdmin = async (req: any, res: any) => {
    try {
        const data = await adminService.getAdminAll();
        res.status(200).json({
            status: 200,
            data: data,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Lỗi khi lấy thông tin người dùng.',
            error: error.message,
        });
    }
};