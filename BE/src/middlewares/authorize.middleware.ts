import { NextFunction, Request,Response } from "express";
import QuyenChucNangModel from "../models/QuyenChucNangModel";
import UserModel from "../models/UserModel";

export const authorize = (requiredFunction:any) => async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {user}:any=req 
       
        const admin = await UserModel.findById(user._id);
        if (!admin) {
            return res.status(401).json({ message: 'Không tìm thấy Admin' });
        }

        const hasPermission = await QuyenChucNangModel.findOne({
            id_quyen: admin.id_quyen,
            id_chuc_nang: requiredFunction,
        });

        if (!hasPermission) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Lỗi kiểm tra quyền', error });
    }
};
