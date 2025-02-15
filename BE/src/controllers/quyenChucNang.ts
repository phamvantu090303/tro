import { Request, Response } from "express";
import QuyenChucNangModel from "../models/QuyenChucNangModel";

export const CreatQuyenChucNang = async (req: Request, res: Response) => {
    try {
        const { id_quyen, id_chuc_nang } = req.body;

        if (!id_quyen || !id_chuc_nang) {
            return res.status(400).json({ message: "Thiếu thông tin id_quyen hoặc id_chuc_nang" });
        }

        // Kiểm tra xem quyền chức năng đã tồn tại chưa
        const existingQuyenChucNang = await QuyenChucNangModel.findOne({ id_quyen, id_chuc_nang });

        if (existingQuyenChucNang) {
            // Xóa bản ghi cũ
            await QuyenChucNangModel.deleteOne({ _id: existingQuyenChucNang._id });
        }

        // Tạo bản ghi mới
        const newQuyenChucNang = new QuyenChucNangModel({ id_quyen, id_chuc_nang });
        await newQuyenChucNang.save();

        return res.status(201).json({ message: "Tạo quyền chức năng thành công", data: newQuyenChucNang });
    } catch (error) {
        console.error("Lỗi khi tạo quyền chức năng:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
