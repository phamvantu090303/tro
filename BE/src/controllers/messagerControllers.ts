import { Request, Response } from "express";
import MessagersService from "../services/messagerServiec";
import AdminModel from "../models/AdminModel";
import QuyensModel from "../models/QuyenModel";
import MessagersModel from "../models/MessagerModel";

const messService = new MessagersService();

export const getAllMess = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const { id_nguoi_nhan } = req.params;

    const data = await messService.messAll(user._id, id_nguoi_nhan);

    res.status(200).json({
      message: "GetAll successfully!!!",
      data: data,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getMessUser = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const quyenAdmin = await QuyensModel.findOne({ ten_quyen: "admin" });
    if (!quyenAdmin) {
      return res.status(404).json({ message: "Không tìm thấy quyền admin." });
    }

    const admin = await AdminModel.findOne({ id_quyen: quyenAdmin._id });
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy admin có quyền admin." });
    }
    const data = await messService.messUser(
      user._id.toString(),
      admin._id.toString()
    );
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      message: "lỗi ",
    });
  }
};

export const getAllMessAdmin = async (req: Request, res: Response) => {
  try {
    const { admin } = req as any;
    const { id_nguoi_nhan } = req.params;

    const data = await messService.messAllAdmin(admin._id, id_nguoi_nhan);

    res.status(200).json({
      message: "GetAll successfully!!!",
      data: data,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//đếm tin nhắn chưa đọc của admin
export const getUnreadMessCountAdmin = async (req: Request, res: Response) => {
  try {
    const { id_nguoi_nhan } = req.params;
    const count = await MessagersModel.countDocuments({
      nguoi_nhan: id_nguoi_nhan,
      is_read: false,
    });
    return res.status(200).json({
      message: "Get unread message count successfully",
      unreadCount: count,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const demtinnhanController = async (req: Request, res: Response) => {
  try {
    const { id_nguoi_nhan } = req.params;
    const count = await messService.getdemtinnhan(id_nguoi_nhan);
    return res.status(200).json({
      message: "Số lượng tin nhắn chưa đọc",
      tinnhanchuadoc: count,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// tin nhắn là đã đọc
export const doctinnhanController = async (req: Request, res: Response) => {
  try {
    const { id_nguoi_nhan } = req.params;
    const doctinnhan = await messService.doctinnhanService(id_nguoi_nhan);
    return res.status(200).json({
      message: "Đã đọc tin nhắn",
      doctinnhan,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
