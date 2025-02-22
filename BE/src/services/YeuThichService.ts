import { ObjectId } from 'mongodb';
import yeuthichModel from "../models/YeuThichModel";

export class YeuThichSevice {
  async createYeuThich(body: any): Promise<void> {
    const data = body;

    const newYeuThich = new yeuthichModel({
      ma_phong: data.ma_phong,
      id_user: data.id_user,
    });
    await newYeuThich.save();
  }

  async deleteById(_id: any): Promise<void> {
    const newYeuThich = await yeuthichModel.findById(_id)
    if (!newYeuThich) {
      throw new Error("loi")
    }
    await yeuthichModel.findByIdAndDelete(_id)
  }

  async getDataYeuTich(id_user: string): Promise<void> {

    const id = new ObjectId(id_user)

    const result = await yeuthichModel.aggregate([
      {
        $match: { id_user: id }
      },
      {
        $lookup: {
          'from': 'phongtros',
          'localField': 'ma_phong',
          'foreignField': 'ma_phong',
          'as': 'phongTro_yeu_thich'
        }
      }, {
        $unwind: {
          'path': '$phongTro_yeu_thich',
          preserveNullAndEmptyArrays: true
        }
      },
    ]);
    return result[0] || null;
  }

  async getAllYeuTich(): Promise<any[]> {

    return await yeuthichModel.aggregate([
      {
        $lookup: {
          'from': 'phongtros',
          'localField': 'ma_phong',
          'foreignField': 'ma_phong',
          'as': 'phongTro_yeu_thich'
        }
      }, {
        $unwind: {
          'path': '$phongTro_yeu_thich',
          preserveNullAndEmptyArrays: true
        }
      },
    ]);
  }
}
const YeuThich = new YeuThichSevice()
export default YeuThich