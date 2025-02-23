import { ObjectId } from 'mongodb';
import { Request,Response } from "express"
import YeuThich, { YeuThichSevice } from "../services/YeuThichService"

export const creatYeuThich = async(req:Request,res:Response) => {
    const data = req.body;
    await YeuThich.createYeuThich(data);
    res.status(200).json({
        message:'Đã thêm vào yêu thích!!',
    })
}

export const deleteYeuThich = async(req:Request,res:Response) => {
    const {id} = req.params;
    await YeuThich.deleteById(id);
    res.status(200).json({
        message:'Đã hủy bỏ yêu thích!!'
    })
}

export const getDataYeuThich = async (req:any, res: any) => {
    try{
        const {id_user} = req.params;
        console.log(id_user)
        const yeuThichService = new YeuThichSevice();
        const data = await yeuThichService.getDataYeuTich(id_user);

        res.status(200).json({
            status: "200",
            data : data
        });
    } catch(error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
}

export const getALLYeuThich = async (req:any, res: any) => {
    try{
        const yeuThichService = new YeuThichSevice();
        const data = await yeuThichService.getAllYeuTich();

        res.status(200).json({
            status: "200",
            data : data
        });
    } catch(error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
}