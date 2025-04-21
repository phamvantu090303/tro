import DanhMucModel from '../models/DanhMucModel';
import { ObjectId } from 'mongodb';
import HopDongModel from '../models/HopDongModel';

export class HopDongService {
    async updateHopDong(_id: any, data: any) {
        const id = new ObjectId(_id);
        const { trang_thai } = data;

        const hopDong = await HopDongModel.findById(id);
        if (!hopDong) {
            throw new Error('hợp đồng không tồn tại');
        }
        hopDong.trang_thai = "yeu_cau_huy_hop_dong"
            // Lưu các thay đổi vào cơ sở dữ liệu
            await hopDong.save();
    }
}
