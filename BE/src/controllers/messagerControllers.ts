import { Request,Response } from "express";
import MessagersService from "../services/messagerServiec";


export const getAllMess = async (req: Request, res: Response) => {
    try {
        const { user } = req as any;  
        const { id_nguoi_nhan } = req.params;

        const messService = new MessagersService();
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