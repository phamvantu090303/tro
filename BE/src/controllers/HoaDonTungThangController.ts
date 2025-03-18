import { Request, Response } from 'express';
import { HoaDonThangService } from '../services/HoaDonTungThangService';
import HoaDonTungThangModel from '../models/HoaDonTungThangModel';

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

 // Hàm tự động tạo hóa đơn mới cho tháng hiện tại dựa trên tháng trước đó
 export const autoCreateHoaDon = async () => {
  try {
    // Lấy tất cả các hóa đơn hiện có, nhóm theo ma_phong để lấy hóa đơn mới nhất cho từng phòng
    const latestHoaDons = await HoaDonTungThangModel.aggregate([
      {
        $sort: { ngay_tao_hoa_don: -1 }, // Sắp xếp giảm dần theo ngày tạo
      },
      {
        $group: {
          _id: "$ma_phong", // Nhóm theo ma_phong
          latestHoaDon: { $first: "$$ROOT" }, // Lấy hóa đơn mới nhất cho mỗi ma_phong
        },
      },
    ]);

    if (!latestHoaDons || latestHoaDons.length === 0) {
      console.log('Chưa có hóa đơn nào trong hệ thống.');
      return;
    }

    // Ngày hiện tại: 09/03/2025
    const currentDate = new Date(); // Thay bằng new Date() trong thực tế
    const currentMonth = currentDate.toISOString().slice(0, 7); // "2025-03"

    // Duyệt qua từng hóa đơn mới nhất của mỗi phòng
    for (const { latestHoaDon } of latestHoaDons) {
      const ma_phong = latestHoaDon.ma_phong;
      const id_users = latestHoaDon.id_users;

      if (!ma_phong || !id_users) {
        console.log(`Hóa đơn của phòng ${ma_phong} thiếu thông tin ma_phong hoặc id_users, bỏ qua.`);
        continue;
      }

      // Lấy tháng của hóa đơn mới nhất
      const lastCreatedDate = new Date(latestHoaDon.ngay_tao_hoa_don);
      const lastMonthDate = new Date(lastCreatedDate.getFullYear(), lastCreatedDate.getMonth(), 1);
      const lastMonthStr = lastMonthDate.toISOString().slice(0, 7); // Tháng của hóa đơn mới nhất (ví dụ: "2025-02")

      // Tháng cần tạo hóa đơn: tháng hiện tại (2025-03)
      const targetMonth = currentMonth;

      // Kiểm tra xem đã có hóa đơn cho tháng hiện tại chưa
      const existingHoaDon = await HoaDonTungThangModel.findOne({
        ma_phong,
        ngay_tao_hoa_don: {
          $gte: new Date(`${targetMonth}-01T00:00:00Z`),
          $lte: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999),
        },
      });

      // Nếu tháng mới nhất nhỏ hơn tháng hiện tại và chưa có hóa đơn cho tháng hiện tại
      if (lastMonthStr < targetMonth && !existingHoaDon) {
        console.log(`Tự động tạo hóa đơn mới cho phòng ${ma_phong}, tháng ${targetMonth}`);
        await hoaDonThangService.taoHoaDon(ma_phong, id_users, targetMonth);
        console.log(`Hóa đơn mới cho phòng ${ma_phong} đã được tạo thành công!`);
      } else if (existingHoaDon) {
        console.log(`Đã có hóa đơn cho phòng ${ma_phong} trong tháng ${targetMonth}, bỏ qua.`);
      } else {
        console.log(`Hóa đơn mới nhất của phòng ${ma_phong} đã ở tháng ${lastMonthStr}, không cần tạo thêm.`);
      }
    }
  } catch (error) {
    console.error('Lỗi khi tự động tạo hóa đơn:', error);
  }
};