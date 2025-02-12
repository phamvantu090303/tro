import DanhMucModel from '../models/DanhMucModel';
import PhongTroModel from '../models/PhongTroModel';

export class PhongtroService {
    async createPhongTro(data: any) {
        const newPhongTro = new PhongTroModel(data);
        return await newPhongTro.save();
    }

    async updatePhongTro(ma_phong: string, updateData: any) {
        return await PhongTroModel.findOneAndUpdate({ ma_phong }, updateData, { new: true });
    }

    async getAllPhongTro(ma_danh_muc: string) {
        // Lấy danh sách mã danh mục từ DanhMucModel
        const danhMuc = await DanhMucModel.findOne({ ma_danh_muc });

        if (!danhMuc) {
            throw new Error('Mã danh mục không tồn tại.');
        }

        // Thực hiện truy vấn aggregate
        return await PhongTroModel.aggregate([
            {
                $match: {
                    ma_danh_muc: ma_danh_muc
                }
            },
            {
                $lookup: {
                    from: 'danh_mucs',
                    localField: 'ma_danh_muc',
                    foreignField: 'ma_danh_muc',
                    as: 'danh_muc'
                }
            },
            {
                $unwind: {
                    path: '$danh_muc',
                }
            }
        ]);
    }

    async deleteAllPhongTro() {
        return await PhongTroModel.deleteMany();
    }

    async deletePhongTroById(ma_phong: string) {
        return await PhongTroModel.findOneAndDelete({ ma_phong });
    }
}
