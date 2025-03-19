import { Request, Response } from 'express';
import { HoaDonThangService } from '../services/HoaDonTungThangService';
import HoaDonTungThangModel from '../models/HoaDonTungThangModel';
import HoaDonThanhToanModel from '../models/HoaDonThanhToanModel';

const hoaDonThangService = new HoaDonThangService();

export const taoHoaDon = async (req: Request, res: Response) => {
  try {
    const { ma_phong, id_users, thang } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ma_phong || !id_users || !thang) {
      return res.status(400).json({ message: 'Thiếu thông tin: ma_phong, id_users, thang là bắt buộc' });
    }
    if (!/^\d{4}-\d{2}$/.test(thang)) {
      return res.status(400).json({ message: 'Định dạng tháng không hợp lệ (YYYY-MM)' });
    }

    const hoaDon = await hoaDonThangService.taoHoaDon(ma_phong, id_users, thang);
    return res.status(201).json({
      message: 'Tạo hóa đơn thành công',
      data: hoaDon,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    console.error('Lỗi không xác định:', error);
    return res.status(500).json({ message: 'Lỗi server nội bộ' });
  }
}

export const getHoaDon = async (req: any, res: any) => {

  try {
    const data = await hoaDonThangService.getDataHoaDon();

    res.status(200).json({
      status: "200",
      data: data,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
}

export const getHoaDonUser = async (req: Request, res: Response) => {
  try {
    const { id_user } = req.params;
    const data = await hoaDonThangService.getUserHoaDon(id_user);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: "404",
        message: "No invoices found for this user",
      });
    }

    res.status(200).json({
      status: "200",
      data: data,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const updateHoaDon = async (req: any, res: any) => {
  try {
    const _id = req.params;
    const data = req.body;

    await hoaDonThangService.updateData(_id, data);

    res.status(200).json({
      message: "Hóa đơn đã được cập nhật thành công",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const deleteHoaDonByID = async (req: any, res: any) => {
  const { id } = req.params;
  try {

    await hoaDonThangService.deleteByIdHoaDon({ id });

    res.status(200).json({
      status: "200",
      message: "Đã xóa thành công!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Hàm tự động tạo hóa đơn mới cho tháng tiếp theo
export const tuDongTaoHoaDonThang = async () => {
  try {
    // Lấy danh sách hóa đơn mới nhất cho từng phòng
    const danhSachHoaDonMoiNhat = await HoaDonTungThangModel.aggregate([
      { $sort: { ngay_tao_hoa_don: -1 } }, // Sắp xếp theo ngày tạo, mới nhất trước
      {
        $group: {
          _id: "$ma_phong",
          hoaDonMoiNhat: { $first: "$$ROOT" }, // Lấy hóa đơn mới nhất của mỗi phòng
        },
      },
    ]);

    if (!danhSachHoaDonMoiNhat?.length) {
      console.log("Chưa có hóa đơn nào trong hệ thống.");
      return;
    }

    const ngayHienTai = new Date();
    const thangHienTai = ngayHienTai.toISOString().slice(0, 7); // Ví dụ: "2025-03"
    const ngayCuoiThang = new Date(ngayHienTai.getFullYear(), ngayHienTai.getMonth() + 1, 0, 23, 59, 59, 999);

    // Duyệt qua từng hóa đơn mới nhất của mỗi phòng
    for (const { hoaDonMoiNhat } of danhSachHoaDonMoiNhat) {
      const { ma_phong, id_users, trang_thai, ngay_tao_hoa_don } = hoaDonMoiNhat;

      if (!ma_phong || !id_users) {
        console.log(`Hóa đơn của phòng ${ma_phong} thiếu mã phòng hoặc ID người dùng, bỏ qua.`);
        continue;
      }

      // Xác định tháng của hóa đơn mới nhất
      const ngayTaoCuoi = new Date(ngay_tao_hoa_don);
      const thangTruoc = new Date(ngayTaoCuoi.getFullYear(), ngayTaoCuoi.getMonth(), 1)
        .toISOString()
        .slice(0, 7);

      // Kiểm tra hóa đơn cho tháng hiện tại đã tồn tại chưa
      const hoaDonDaTonTai = await HoaDonTungThangModel.findOne({
        ma_phong,
        ngay_tao_hoa_don: {
          $gte: new Date(`${thangHienTai}-01T00:00:00Z`),
          $lte: ngayCuoiThang,
        },
      });

      // Kiểm tra trạng thái thanh toán và xử lý
      if (trang_thai === "chưa thanh toán") {
        console.log(`Phòng ${ma_phong} có hóa đơn tháng ${thangTruoc} chưa thanh toán. Yêu cầu thanh toán!`);
        continue; // Bỏ qua nếu chưa thanh toán
      }

      // So sánh và tạo hóa đơn nếu cần
      if (trang_thai === "đã thanh toán" && thangTruoc < thangHienTai && !hoaDonDaTonTai) {
        console.log(`Tự động tạo hóa đơn tháng tiến theo: ${thangHienTai} cho phòng ${ma_phong}`);
        await hoaDonThangService.taoHoaDon(ma_phong, id_users, thangHienTai);
        console.log(`Hóa đơn tháng tiến theo: ${thangHienTai} cho phòng ${ma_phong} đã được tạo!`);
      } else if (hoaDonDaTonTai) {
        console.log(`Phòng ${ma_phong} đã có hóa đơn tháng ${thangHienTai}!`);
      } else {
        console.log(`Đã có hóa đơn mới nhất của phòng ${ma_phong} là tháng ${thangTruoc}`);
      }
    }
  } catch (error) {
    console.error("Lỗi khi tự động tạo hóa đơn tháng tiến theo:", error);
  }
};

// Hàm tự động tạo hóa đơn tháng đầu tiên cho phòng được thuê
export const tuDongTaoHoaDon = async () => {
  try {
    const danhSachHoaDonMoiNhat = await HoaDonThanhToanModel.aggregate([
      { $sort: { ngay_chuyen_khoan: -1 } },
      {
        $group: {
          _id: "$ma_phong",
          hoaDonMoiNhat: { $first: "$$ROOT" },
        },
      },
    ]);

    if (!danhSachHoaDonMoiNhat?.length) {
      console.log("Chưa có hóa đơn nào trong hệ thống.");
      return;
    }

    const ngayHienTai = new Date();
    const thangHienTai = ngayHienTai.toISOString().slice(0, 7);
    const ngayCuoiThang = new Date(ngayHienTai.getFullYear(), ngayHienTai.getMonth() + 1, 0, 23, 59, 59, 999);

    for (const { hoaDonMoiNhat } of danhSachHoaDonMoiNhat) {
      const { ma_phong, id_users, trang_thai, ngay_chuyen_khoan } = hoaDonMoiNhat;

      if (!ma_phong || !id_users) {
        console.log(`Hóa đơn của phòng ${ma_phong} thiếu mã phòng hoặc ID người dùng, bỏ qua.`);
        continue;
      }

      const ngayChuyenKhoanCuoi = new Date(ngay_chuyen_khoan);
      const thangTruoc = new Date(ngayChuyenKhoanCuoi.getFullYear(), ngayChuyenKhoanCuoi.getMonth(), 1)
        .toISOString()
        .slice(0, 7);

      const hoaDonDaTonTai = await HoaDonTungThangModel.findOne({
        ma_phong,
        ngay_tao_hoa_don: {
          $gte: new Date(`${thangHienTai}-01T00:00:00Z`),
          $lte: ngayCuoiThang,
        },
      });

      if (trang_thai === "chưa thanh toán") {
        console.log(`Phòng ${ma_phong} có hóa đơn thuê trọ chưa thanh toán. Yêu cầu thanh toán!.`);
        continue;
      }

      if (trang_thai === "đã thanh toán" && thangTruoc < thangHienTai && !hoaDonDaTonTai) {
        console.log(`Tự động tạo hóa đơn tháng đầu tiên: ${thangHienTai} cho phòng ${ma_phong}`);
        await hoaDonThangService.taoHoaDon(ma_phong, id_users, thangHienTai);
        console.log(`Hóa đơn tháng đầu tiên: ${thangHienTai} cho phòng ${ma_phong} đã được tạo thành công!`);
      } else if (hoaDonDaTonTai) {
        console.log(`Phòng ${ma_phong} đã có hóa đơn tháng đầu tiên.`);
      } else {
        console.log(`Đã có hóa đơn của phòng ${ma_phong} là tháng ${thangTruoc}.`);
      }
    }
  } catch (error) {
    console.error("Lỗi khi tự động tạo hóa đơn tháng đầu tiên:", error);
  }
};