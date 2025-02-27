import DanhGiaModel from "../models/DanhGiaModel";

class DanhGiaService {
    async createDanhGia(data: any, userId: any) {
        try {
            const danhGia = new DanhGiaModel(data);
            danhGia.id_user = userId;
            await danhGia.save();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }
    async getDataDanhGia(ma_phong: string) {
        try {
            const danhGia = await DanhGiaModel.aggregate([
                {
                    $match: { ma_phong: ma_phong }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "id_user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $project: {
                        "user.password": 0,
                        "user.verify": 0,
                        "user.cccd": 0,
                        "user.ngay_sinh": 0,
                        "user.id_quyen": 0,
                        "user.so_dien_thoai": 0,
                        "user.gioi_tinh": 0
                    }
                }
            ]);
            return danhGia;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    
    async DeleteDanhGia(id: string) {
        try {
            await DanhGiaModel.findByIdAndDelete(id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    
}
export default DanhGiaService;