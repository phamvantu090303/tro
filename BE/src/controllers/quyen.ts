import { Request, Response } from 'express';
import QuyenService from '../services/QuyenService';

export const storeQuyen = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const quyenService = new QuyenService();
        const result = await quyenService.createQuyen(body);
        res.status(201).json({ message: "Tạo quyền thành công!", data: result });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateQuyen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const quyenService = new QuyenService();
        const updatedQuyen = await quyenService.updateQuyen(id, body);

        if (!updatedQuyen) {
            return res.status(404).json({ message: "Không tìm thấy quyền!" });
        }

        res.status(200).json({ message: "Cập nhật quyền thành công!", data: updatedQuyen });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteQuyen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const quyenService = new QuyenService();
        const result = await quyenService.DeleteQuyen(id);

        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy quyền!" });
        }

        res.status(200).json({ message: "Xóa quyền thành công!" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getQuyen = async (req: Request, res: Response) => {
    try {
        const quyenService = new QuyenService();
        const data = await quyenService.getQuyen();

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Không có quyền nào!" });
        }

        res.status(200).json({ message: "Lấy danh sách quyền thành công!", data });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
