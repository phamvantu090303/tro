import { Request, Response } from "express";
import MessagersService from "../services/messagerServiec";
import AdminModel from "../models/AdminModel";
import QuyensModel from "../models/QuyenModel";

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
