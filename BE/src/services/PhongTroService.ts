import PhongTroModel from '../models/PhongTroModel';

export class PhongtroService {
    async createPhongTro(data: any) {
        const newPhongTro = new PhongTroModel(data);
        return await newPhongTro.save();
    }

    async updatePhongTro(ma_phong: string, updateData: any) {
        return await PhongTroModel.findOneAndUpdate({ ma_phong }, updateData, { new: true });
    }

    async getAllPhongTro() {
        return await PhongTroModel.find();
    }

    async deleteAllPhongTro() {
        return await PhongTroModel.deleteMany();
    }

    async deletePhongTroById(ma_phong: string) {
        return await PhongTroModel.findOneAndDelete({ ma_phong });
    }
}
