import DanhMucModel from '../models/DanhMucModel';
import { ObjectId } from 'mongodb';
import HopDongModel from '../models/HopDongModel';

export class HopDongService {
    async updateHopDong(_id: any, data: any) {
        const id = new ObjectId(_id);
        const { 
            ma_phong,
            id_users,
            start_date,
            end_date,
            tien_coc,
            trang_thai,
            file_hop_dong, 
        } = data;

        const hopDong = await HopDongModel.findById(id);
        if (!hopDong) {
            throw new Error('hợp đồng không tồn tại');
        }
        hopDong.ma_phong = ma_phong ?? hopDong.ma_phong;
        hopDong.id_users = id_users ?? hopDong.id_users;
        hopDong.start_date = start_date ?? hopDong.start_date;
        hopDong.end_date = end_date ?? hopDong.end_date;
        hopDong.tien_coc = tien_coc ?? hopDong.tien_coc;
        hopDong.trang_thai = trang_thai ?? hopDong.trang_thai;
        hopDong.file_hop_dong = file_hop_dong ?? hopDong.file_hop_dong;

        await hopDong.save();
    }

    async yeuCauHuyHD(_id: any, data: any) {
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

    async getDataHopDong(): Promise<any[]> {
        return await HopDongModel.aggregate([
            {
              // Chuyển id_users (string) thành ObjectId
              $addFields: {
                id_users: { $toObjectId: "$id_users" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "id_users",
                foreignField: "_id",
                as: "id_users",
              },
            },
            {
              $unwind: {
                path: "$id_users", // biến nó thành object
                //preserveNullAndEmptyArrays: false, // hoặc true nếu muốn giữ bản ghi lỗi
              },
            },
            {
              // Chỉ lấy các trường cần thiết
              $project: {
                ma_phong: 1,
                id_user: "$id_users._id",
                ho_va_ten: "$id_users.ho_va_ten",
                start_date: 1,
                end_date: 1,
                tien_coc: 1,
                trang_thai: 1,
                file_hop_dong: 1,
              },
            },
          ]);
    }

    async deleteHopDong(body: any): Promise<void> {
        const { id } = body;
        const danhMuc = await HopDongModel.findById(id);
        if (!danhMuc) {
          throw new Error("Hóa đơn không tồn tại");
        }
        await HopDongModel.findByIdAndDelete(id);
      }
}
