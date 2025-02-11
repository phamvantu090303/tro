import mongoose, { Schema } from 'mongoose';

const HoaDonTungThangSchema = new Schema(
    {
        id_phong: { type: String, required: true },
        id_users: { type: String, required: true },
        chi_so_dien_thang_nay: { type: Number, required: true },
        chi_so_dien_thang_truoc: { type: Number, required: true },
        so_dien_tieu_thu: { type: Number, required: true }, // Chênh lệch
        tien_dien: { type: Number, required: true },
        tien_phong: { type: Number, required: true },      // Tiền phòng
        tong_tien: { type: Number, required: true },       // Tổng tiền = tiền điện + tiền phòng + dịch vụ
        trang_thai: { type: String, default: "chưa thanh toán" },
        ngay_tao_hoa_don: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const HoaDonTungThangModel = mongoose.model('hoadontungthang', HoaDonTungThangSchema);
export default HoaDonTungThangModel;
