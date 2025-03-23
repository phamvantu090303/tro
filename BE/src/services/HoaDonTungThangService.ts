import { ObjectId } from "mongodb";
import Electricity from "../models/Electricity";
import DichVuModel from "../models/DichVuModel";
import HoaDonTungThangModel from "../models/HoaDonTungThangModel";
import PhongTroModel from "../models/PhongTroModel";

const startOfMonth = (thang: string) => new Date(`${thang}-01T00:00:00Z`);
const endOfMonth = (thang: string) => {
  const date = new Date(`${thang}-01T00:00:00Z`);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

export class HoaDonThangService {
  async taoHoaDon(ma_phong: string, id_users: string, thang: string) {
    try {
      // Lấy dữ liệu điện trong tháng và sắp xếp theo timestamp giảm dần để lấy bản ghi mới nhất
      const electricityData = await Electricity.find({
        room_id: ma_phong,
        timestamp: { $gte: startOfMonth(thang), $lte: endOfMonth(thang) },
      }).sort({ timestamp: -1 });

      if (!electricityData.length) {
        throw new Error("Không có dữ liệu tiêu thụ điện trong tháng này");
      }

      // Lấy bản ghi mới nhất (bản ghi đầu tiên sau khi sắp xếp)
      const latestElectricity = electricityData[0];
      const chiSoDienThangNay = latestElectricity.energy;
      console.log("latestElectricity", latestElectricity);
      // Lấy dữ liệu dịch vụ
      const dichVu = await DichVuModel.findOne();
      if (!dichVu)
        throw new Error("Không tìm thấy thông tin dịch vụ cho phòng này");

      const tienNuoc = dichVu.tien_nuoc ?? 0;
      const tienWifi = dichVu.tien_wifi ?? 0;

      // Tính tổng tiền
      const phongTro = await PhongTroModel.findOne();
      if (!phongTro) {
        throw new Error("Không tìm thấy thông tin phòng trọ");
      }
      const tienPhong = phongTro.gia_tien;

      // Lấy chỉ số điện tháng trước
      const previousMonth = new Date(startOfMonth(thang));
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const hoaDonThangTruoc = await HoaDonTungThangModel.findOne({
        ma_phong,
        ngay_tao_hoa_don: {
          $gte: startOfMonth(previousMonth.toISOString().slice(0, 7)),
          $lte: endOfMonth(previousMonth.toISOString().slice(0, 7)),
        },
      }).sort({ ngay_tao_hoa_don: -1 });

      const chiSoDienThangTruoc = hoaDonThangTruoc?.chi_so_dien_thang_nay || 0;

      // Tính số điện tiêu thụ và kiểm tra
      const soDienTieuThu = chiSoDienThangNay - chiSoDienThangTruoc;
      if (soDienTieuThu < 0) {
        throw new Error(
          "Số điện tiêu thụ không hợp lệ (âm), kiểm tra lại chỉ số điện"
        );
      }

      const tienDien = soDienTieuThu * 3500;
      const tongTien = tienPhong + tienDien + tienNuoc + tienWifi;

      // Tạo hóa đơn
      const hoaDon = new HoaDonTungThangModel({
        ma_phong,
        id_users,
        chi_so_dien_thang_nay: chiSoDienThangNay,
        chi_so_dien_thang_truoc: chiSoDienThangTruoc,
        so_dien_tieu_thu: soDienTieuThu,
        tien_dien: tienDien,
        tien_phong: tienPhong,
        dich_vu: dichVu._id,
        electricity_data: latestElectricity, // Chỉ lưu _id của bản ghi mới nhất
        tong_tien: tongTien,
      });

      await hoaDon.save();
      return hoaDon;
    } catch (error) {
      throw new Error(
        `Lỗi khi tạo hóa đơn: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getDataHoaDon(): Promise<any[]> {
    const hoaDonThang = await HoaDonTungThangModel.find();
    return hoaDonThang;
  }

  async getUserHoaDon(id_user: string): Promise<any[]> {
    const id = new ObjectId(id_user);
    const hoaDonThang = await HoaDonTungThangModel.find({ id_users: id });
    return hoaDonThang;
  }

  // Cập nhật thông tin danh mục
  async updateData(_id: any, data: any): Promise<void> {
    const id = new ObjectId(_id);
    const {
      ma_phong,
      id_users,
      chi_so_dien_thang_nay,
      chi_so_dien_thang_truoc,
      so_dien_tieu_thu,
      tien_dien,
      tien_phong,
      dich_vu,
      tong_tien,
      trang_thai,
      ngay_tao_hoa_don,
    } = data;

    const hoaDon = await HoaDonTungThangModel.findById(id);
    if (!hoaDon) {
      throw new Error("Hóa đơn không tồn tại");
    }

    hoaDon.ma_phong = ma_phong ?? hoaDon.ma_phong;
    hoaDon.id_users = id_users ?? hoaDon.id_users;
    hoaDon.chi_so_dien_thang_nay =
      chi_so_dien_thang_nay ?? hoaDon.chi_so_dien_thang_nay;
    hoaDon.chi_so_dien_thang_truoc =
      chi_so_dien_thang_truoc ?? hoaDon.chi_so_dien_thang_truoc;
    hoaDon.so_dien_tieu_thu = so_dien_tieu_thu ?? hoaDon.so_dien_tieu_thu;
    hoaDon.tien_dien = tien_dien ?? hoaDon.tien_dien;
    hoaDon.tien_phong = tien_phong ?? hoaDon.tien_phong;
    hoaDon.tong_tien = tong_tien ?? hoaDon.tong_tien;
    hoaDon.trang_thai = trang_thai ?? hoaDon.trang_thai;
    hoaDon.ngay_tao_hoa_don = ngay_tao_hoa_don ?? hoaDon.ngay_tao_hoa_don;

    await hoaDon.save();
  }

  async deleteByIdHoaDon(body: any): Promise<void> {
    const { id } = body;
    const danhMuc = await HoaDonTungThangModel.findById(id);
    if (!danhMuc) {
      throw new Error("Hóa đơn không tồn tại");
    }
    await HoaDonTungThangModel.findByIdAndDelete(id);
  }
}

export default HoaDonThangService;
