import DanhMucModel from "../models/DanhMucModel";
import PhongTroModel from "../models/PhongTroModel";

export class PhongtroService {
  async createPhongTro(data: any) {
    const newPhongTro = new PhongTroModel(data);
    return await newPhongTro.save();
  }

  async updatePhongTro(ma_phong: string, updateData: any) {
    if (updateData._id) {
      delete updateData._id;
    }

    return await PhongTroModel.findOneAndUpdate({ ma_phong }, updateData, {
      new: true,
    });
  }

  async getAllPhongTro() {
    return await PhongTroModel.aggregate([
      {
        $lookup: {
          from: "danh_mucs",
          localField: "ma_danh_muc",
          foreignField: "ma_danh_muc",
          as: "danh_muc",
        },
      },
      {
        $unwind: {
          path: "$danh_muc",
          preserveNullAndEmptyArrays: true, // Giữ lại nếu không có dữ liệu
        },
      },
      {
        $match: {
          "danh_muc.trang_thai": 1, // Chỉ lấy những danh mục có trạng thái = 1
        },
      },
      {
        $lookup: {
          from: "maps",
          localField: "ma_map",
          foreignField: "ma_map",
          as: "mapDetail",
        },
      },
      {
        $unwind: {
          path: "$mapDetail",
          preserveNullAndEmptyArrays: true, // Giữ lại nếu không có dữ liệu
        },
      },
    ]);
  }

  async deleteAllPhongTro() {
    return await PhongTroModel.deleteMany();
  }

  async deletePhongTroById(ma_phong: string) {
    return await PhongTroModel.findOneAndDelete({ ma_phong });
  }

  async getDetailPhongTro(ma_phong: string) {
    const result = await PhongTroModel.aggregate([
      {
        $match: { ma_phong: ma_phong },
      },
      {
        $lookup: {
          from: "danh_mucs",
          localField: "ma_danh_muc",
          foreignField: "ma_danh_muc",
          as: "danh_muc",
        },
      },
      {
        $unwind: {
          path: "$danh_muc",
        },
      },
      {
        $lookup: {
          from: "hinh_anh_phongs",
          localField: "ma_phong",
          foreignField: "ma_phong",
          as: "anh",
        },
      },
      {
        $lookup: {
          from: "maps",
          localField: "ma_map",
          foreignField: "ma_map",
          as: "mapDetail",
        },
      },
      {
        $unwind: {
          path: "$mapDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "thiet_bis",
          localField: "ma_phong",
          foreignField: "ma_phong",
          as: "thietBi",
        },
      },
    ]);
    return result[0] || null;
  }
  async getPhongTroByMap(ma_map: string) {
    return await PhongTroModel.find({ ma_map });
  }
  async checkPhongTro(id_user: string) {
    const phongTro = await PhongTroModel.findOne({ id_users: id_user });

    return !!phongTro;
  }
}
