import { Request,Response } from "express";
import DichVuService from "../services/DichVu";

export const CreateDichVu = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        console.log(data);
        const dichVuServiceInstance = new DichVuService();
        await dichVuServiceInstance.CreatDichVu(data);  

        res.status(200).json({
        message: "Create successfully!!!",
        });
    } catch (error: any) {
        res.status(404).json({
        message: error.message,
        });
    }
}

export const UpdateDichVu = async (req: Request, res: Response) => {
    try {
        const _id = req.params;
        const data = req.body;
        const dichVuServiceInstance = new DichVuService();
        await dichVuServiceInstance.UpdateDichVu(_id, data);  

        res.status(200).json({
        message: "Update successfully!!!",
        });
    } catch (error: any) {
        res.status(404).json({
        message: error.message,
        });
    }
}

export const DeleteDichVu = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const dichVuServiceInstance = new DichVuService();
        await dichVuServiceInstance.DeleteDichVu(id);  

        res.status(200).json({
        message: "Delete successfully!!!",
        });
    } catch (error: any) {
        res.status(404).json({
        message: error.message,
        });
    }
}

export const GetAllDichVu = async (req: Request, res: Response) => {
    try {
        const dichVuServiceInstance = new DichVuService();
        const data = await dichVuServiceInstance.GetAllDichVu();  

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