import { Request, Response } from "express";
import { HoaDonThangService } from "../services/HoaDonTungThangService";
import HoaDonTungThangModel from "../models/HoaDonTungThangModel";
import HoaDonThanhToanModel from "../models/HoaDonThanhToanModel";
import nodemailer from "nodemailer";
import UserModel from "../models/UserModel";
import DichVuModel from "../models/DichVuModel";

const hoaDonThangService = new HoaDonThangService();

export const taoHoaDon = async (req: Request, res: Response) => {
  try {
    const { ma_phong, id_users, thang } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ma_phong || !id_users || !thang) {
      return res.status(400).json({
        message: "Thiếu thông tin: ma_phong, id_users, thang là bắt buộc",
      });
    }
    if (!/^\d{4}-\d{2}$/.test(thang)) {
      return res
        .status(400)
        .json({ message: "Định dạng tháng không hợp lệ (YYYY-MM)" });
    }

    const hoaDon = await hoaDonThangService.taoHoaDon(
      ma_phong,
      id_users,
      thang
    );
    return res.status(201).json({
      message: "Tạo hóa đơn tháng thành công",
      data: hoaDon,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    console.error("Lỗi không xác định:", error);
    return res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};

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
};

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
    const ngayCuoiThang = new Date(
      ngayHienTai.getFullYear(),
      ngayHienTai.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const ngươithue = await UserModel.findOne({
      _id: danhSachHoaDonMoiNhat[0].hoaDonMoiNhat.id_users,
    });
    if (ngươithue) {
      console.log(ngươithue.email);
    } else {
      console.log("Người thuê không tồn tại.");
    }

    // Duyệt qua từng hóa đơn mới nhất của mỗi phòng
    for (const { hoaDonMoiNhat } of danhSachHoaDonMoiNhat) {
      const { ma_phong, id_users, trang_thai, ngay_tao_hoa_don } =
        hoaDonMoiNhat;

      if (!ma_phong || !id_users) {
        console.log(
          `Hóa đơn của phòng ${ma_phong} thiếu mã phòng hoặc ID người dùng, bỏ qua.`
        );
        continue;
      }

      // Xác định tháng của hóa đơn mới nhất
      const ngayTaoCuoi = new Date(ngay_tao_hoa_don);
      const thangTruoc = new Date(
        ngayTaoCuoi.getFullYear(),
        ngayTaoCuoi.getMonth(),
        1
      )
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
        console.log(
          `Phòng ${ma_phong} có hóa đơn tháng ${thangTruoc} chưa thanh toán. Yêu cầu thanh toán!`
        );
        continue; // Bỏ qua nếu chưa thanh toán
      }

      // So sánh và tạo hóa đơn nếu cần
      if (
        trang_thai === "đã thanh toán" &&
        thangTruoc < thangHienTai &&
        !hoaDonDaTonTai
      ) {
        console.log(
          `Tự động tạo hóa đơn tháng tiến theo: ${thangHienTai} cho phòng ${ma_phong}`
        );
        const newHoaDon = await hoaDonThangService.taoHoaDon(
          ma_phong,
          id_users,
          thangHienTai
        );

        // Gửi email
        await sendEmail(ngươithue, newHoaDon);

        console.log(
          `Hóa đơn tháng tiến theo: ${thangHienTai} cho phòng ${ma_phong} đã được tạo!`
        );
      } else if (hoaDonDaTonTai) {
        console.log(`Phòng ${ma_phong} đã có hóa đơn tháng ${thangHienTai}!`);
      } else {
        console.log(
          `Đã có hóa đơn mới nhất của phòng ${ma_phong} là tháng ${thangTruoc}`
        );
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
    const ngayCuoiThang = new Date(
      ngayHienTai.getFullYear(),
      ngayHienTai.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const ngươithue = await UserModel.findOne({
      _id: danhSachHoaDonMoiNhat[0].hoaDonMoiNhat.id_users,
    });
    if (ngươithue) {
      console.log(ngươithue.email);
    } else {
      console.log("Người thuê không tồn tại.");
    }

    for (const { hoaDonMoiNhat } of danhSachHoaDonMoiNhat) {
      const { ma_phong, id_users, trang_thai, ngay_chuyen_khoan } =
        hoaDonMoiNhat;

      if (!ma_phong || !id_users) {
        console.log(
          `Hóa đơn của phòng ${ma_phong} thiếu mã phòng hoặc ID người dùng, bỏ qua.`
        );
        continue;
      }

      const ngayChuyenKhoanCuoi = new Date(ngay_chuyen_khoan);
      const thangTruoc = new Date(
        ngayChuyenKhoanCuoi.getFullYear(),
        ngayChuyenKhoanCuoi.getMonth(),
        1
      )
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
        console.log(
          `Phòng ${ma_phong} có hóa đơn thuê trọ chưa thanh toán. Yêu cầu thanh toán!.`
        );
        continue;
      }

      if (
        trang_thai === "đã thanh toán" &&
        thangTruoc < thangHienTai &&
        !hoaDonDaTonTai
      ) {
        console.log(
          `Tự động tạo hóa đơn tháng đầu tiên: ${thangHienTai} cho phòng ${ma_phong}`
        );
        const newHoaDon = await hoaDonThangService.taoHoaDon(
          ma_phong,
          id_users,
          thangHienTai
        );

        // Gửi email
        await sendEmail(ngươithue, newHoaDon);

        console.log(
          `Hóa đơn tháng đầu tiên: ${thangHienTai} cho phòng ${ma_phong} đã được tạo thành công!`
        );
      } else if (hoaDonDaTonTai) {
        console.log(`Phòng ${ma_phong} đã có hóa đơn tháng đầu tiên.`);
      } else {
        console.log(
          `Đã có hóa đơn của phòng ${ma_phong} là tháng ${thangTruoc}.`
        );
      }
    }
  } catch (error) {
    console.error("Lỗi khi tự động tạo hóa đơn tháng đầu tiên:", error);
  }
};

// Hàm gửi email
const sendEmail = async (ngươithue: any, hoaDon: any) => {
  // Lấy dữ liệu dịch vụ
  const dichVu = await DichVuModel.findOne();
  if (!dichVu)
    throw new Error("Không tìm thấy thông tin dịch vụ cho phòng này");

  const giaDien = dichVu.tien_dien ?? 0;
  const tienNuoc = dichVu.tien_nuoc ?? 0;
  const tienWifi = dichVu.tien_wifi ?? 0;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: ngươithue.email,
    subject: "Hóa Đơn Thuê Trọ Hàng Tháng",
    html: `
    <div style="max-width: 600px; margin: 20px auto; padding: 25px; font-family: 'Arial', sans-serif; border: 1px solid #e0e0e0; border-radius: 12px; background: linear-gradient(135deg, #ffffff, #f5f7fa); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="../../../FE/src/assets/logo/Logo.svg" alt="Logo" style="width: 100px; max-width: 100%; height: auto;">
      </div>

      <!-- Tiêu đề -->
      <h2 style="text-align: center; color: #2c3e50; font-size: 24px; margin-bottom: 20px;">📄 HÓA ĐƠN THUÊ TRỌ THÁNG</h2>
      <p style="text-align: center; color: #555; font-size: 16px; margin-bottom: 25px;">Chào <b>${
        ngươithue.ho_va_ten || ngươithue.username || "Khách hàng"
      }</b>, dưới đây là hóa đơn tháng mới của bạn.</p>

      <!-- Nội dung hóa đơn -->
      <div style="background: #fff; padding: 20px; border-left: 5px solid #e91e63; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; color: #333; margin-right:10px;">Mã hóa đơn:</h3>
          <p style="font-size: 16px; color: #666;">${
            hoaDon.ma_hoa_don_thang || "N/A"
          }</p>  
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; color: #333; margin-right:10px;">Mã phòng:</h3>
          <p style="font-size: 16px; color: #666;">${hoaDon.ma_phong}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; color: #333; margin-right:10px;">Tiền phòng:</h3>
          <p style="font-size: 16px; color: #666;">${hoaDon.tien_phong} VND</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; color: #333; margin-right:10px;">Tiền điện:</h3>
          <p style="font-size: 16px; color: #666;">${giaDien} VND</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; color: #333; margin-right:10px;">Tiền Nước:</h3>
          <p style="font-size: 16px; color: #666;">${tienNuoc} VND</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; color: #333; margin-right:10px;">Tiền Wifi:</h3>
          <p style="font-size: 16px; color: #666;">${tienWifi} VND</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; color: #333; margin-right:10px;">Tổng tiền:</h3>
          <p style="font-size: 16px; color: #666;">${hoaDon.tong_tien} VND</p>
        </div>
        <!-- Thông tin thanh toán -->
        <div style="font-size: 13px; color: #555; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
          <h4 style="font-size: 16px; color: #333; margin-bottom: 8px;">Thông tin thanh toán</h4>
          <p style="margin: 5px 0;">Vui lòng thanh toán trong vòng 15 ngày kể từ ngày nhận hóa đơn.</p>
          <h4 style="font-size: 16px; color: #333; margin-bottom: 8px; margin-top: 15px;">Chi tiết ngân hàng</h4>
          <p style="margin: 5px 0;"><strong>Tên ngân hàng:</strong> Vietcombank</p>
          <p style="margin: 5px 0;"><strong>Mã Swift:</strong> ABCDEFGH</p>
          <p style="margin: 5px 0;"><strong>Số tài khoản:</strong> 1234 5678 9012 3456</p>
        </div>
      </div>
    </div>

    <!-- CSS Responsive -->
    <style>
      @media (max-width: 480px) {
        div[style*="max-width: 600px"] { padding: 15px; margin: 10px; }
        h2 { font-size: 20px; }
        p, a { font-size: 14px !important; }
        img { width: 80px; }
        div[style*="display: flex; justify-content: space-between"] { flex-direction: column; }
      }
    </style>
    `,
  };

  await transporter.sendMail(mailOptions);
};
