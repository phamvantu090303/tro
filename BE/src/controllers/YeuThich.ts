import { Request,Response } from "express"
import YeuThich from "../services/YeuThichService"

export const creatYeuThich = async(req:Request,res:Response) => {
    const data = req.body;
    console.log(data);
    await YeuThich.createYeuThich(data);
    res.status(200).json({
        message:'Đã thêm vào yêu thích!!',
    })
}

export const deleteYeuThich = async(req:Request,res:Response) => {
    const {id} = req.params;
    await YeuThich.deleteById({id});
    res.status(200).json({
        message:'Đã hủy bỏ yêu thích!!'
    })
}