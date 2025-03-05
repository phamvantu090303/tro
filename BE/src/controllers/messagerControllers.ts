import { Request,Response } from "express";
import MessagersService from "../services/messagerServiec";

const messService = new MessagersService();

export const getAllMess = async (req: Request, res: Response) => {
    try {
        const { user } = req as any;  
        const { id_nguoi_nhan } = req.params;


        const data = await messService.messAll(user._id, id_nguoi_nhan);  

        console.log(user);
        console.log(user._id, id_nguoi_nhan);

        res.status(200).json({
        message: "GetAll successfully!!!",
        data: data
        });
    } catch (error: any) {
        res.status(404).json({
        message: error.message,
        });
    }
}

export const getAllMessAdmin = async (req: Request, res: Response) => {
    try {
        const { admin } = req as any;  
        const { id_nguoi_nhan } = req.params;


        const data = await messService.messAllAdmin(admin._id, id_nguoi_nhan);  

        console.log(admin);
        console.log(admin._id, id_nguoi_nhan);

        res.status(200).json({
        message: "GetAll successfully!!!",
        data: data
        });
    } catch (error: any) {
        res.status(404).json({
        message: error.message,
        });
    }
}