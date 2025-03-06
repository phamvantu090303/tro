import dotenv from "dotenv";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { UserVerifyStatus } from "../constants/enum";
import UserModel from "../models/UserModel";

dotenv.config();
const userService = new UserService();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const register = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const email_verify_token = await userService.registerUser(body);
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: body.email,
      subject: "Xác thực tài khoản của bạn",
      text: `Chào ${body.username}, vui lòng xác thực tài khoản của bạn bằng cách nhấp vào liên kết sau: ${process.env.CLIENT_ORIGIN}/verify-email?token=${email_verify_token}`,
    };
    //cấu hình gửi email
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Đăng ký thành công!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};
export const login = async (req: Request, res: Response) => {
  const { user }: any = req; // Lấy thông tin người dùng từ request
  try {
    const token = await userService.loginUser(user._id, user.verify);

    res.status(200).json({
      message: "Login successfully!!!",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          hovaten: user.ho_va_ten,
          ngaysinh: user.ngay_sinh,
          sdt: user.so_dien_thoai,
          gioi_tinh: user.gioi_tinh,
          cccd: user.cccd,
        },
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message, // Trả về lỗi nếu có
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { decodedEmailToken } = req as any;
    const userId = decodedEmailToken._id;

    // Tìm người dùng theo ID
    const user = await UserModel.findById(userId);

    // Kiểm tra nếu người dùng không tồn tại
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Kiểm tra nếu người dùng đã xác thực
    if (user.verify === UserVerifyStatus.Verified) {
      return res
        .status(400)
        .json({ message: "Người dùng đã được xác thực trước đó." });
    }

    // Cập nhật trạng thái verify
    user.verify = UserVerifyStatus.Verified;
    await user.save();

    return res.status(200).json({
      message: "Xác thực email thành công.",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi xác thực email.",
      error: error.message,
    });
  }
};

export const sendPassword = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const result = await userService.forgotPassword(user._id, user.verify);
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: "Xác thực tài khoản của bạn để đổi mật khẩu",
      text: `Chào ${user.username}, vui lòng xác thực tài khoản của bạn bằng cách nhấp vào liên kết sau: ${process.env.CLIENT_ORIGIN}/reset-password?token=${result}`,
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
};

export const verifypassword = async (req: Request, res: Response) => {
  try {
    const { User } = req as any;
    const { New_password, confirm_Password } = req.body;

    if (New_password !== confirm_Password) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
    }
    const result = await userService.ResetPassWord(User._id, New_password);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi đổi mật khẩu.",
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const data = req.body;
    await userService.updateUserService(user._id, data);

    res.status(200).json({
      message: "user đã được cập nhật thành công",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getMe = async (req: any, res: any) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    const data = await userService.getMe(user._id);

    res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin người dùng.",
      error: error.message,
    });
  }
};

export const getAllUser = async (req: any, res: any) => {
  try {
    const data = await userService.getUserAll();

    res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin người dùng.",
      error: error.message,
    });
  }
};
