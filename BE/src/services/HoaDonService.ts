import HoaDonModel from "../models/HoaDonTungThangModel";

class HoaDonService {
    async create(data: any) {
        return await HoaDonModel.create(data);
    }

    async getAll() {
        return await HoaDonModel.find();
    }

    async getById(id: string){
        return await HoaDonModel.findById(id);
    }
}

export default new HoaDonService();