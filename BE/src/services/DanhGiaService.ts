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
            const danhGia = await DanhGiaModel.find({ ma_phong }).lean();
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