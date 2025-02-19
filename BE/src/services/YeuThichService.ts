import { ObjectId } from 'mongodb';
import yeuthichModel from "../models/YeuThichModel";

export class YeuThichSevice {
    async createYeuThich(body: any): Promise<void> {
        const data = body;

        const newYeuThich = new yeuthichModel({
            ma_phong : data.ma_phong,
            id_user : data.id_user,
        }); 
        await newYeuThich.save();
    } 

    async deleteById(_id: any): Promise<void> {
        const newYeuThich = await yeuthichModel.findById(_id)
        if(!newYeuThich){
            throw new Error ("loi")
        }
        await yeuthichModel.findByIdAndDelete(_id)
    }

    async getDataYeuTich(){
        return await yeuthichModel.aggregate([
            {
              $lookup: {
                'from': 'users', 
                'localField': 'id_user', 
                'foreignField': '_id', 
                'as': 'user_yeu_thich'
              }
            }, {
              $unwind: {
                'path': '$user_yeu_thich'
              }
            }, {
              $lookup: {
                'from': 'phongtros', 
                'localField': 'ma_phong', 
                'foreignField': 'ma_phong', 
                'as': 'phongTro_yeu_thich'
              }
            }
        ]);
    }
}
const YeuThich = new YeuThichSevice()
export default YeuThich