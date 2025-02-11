import ChiSoDongHoModel from "../models/ChiSoDongHoModel";
import HoaDonTungThangModel from "../models/HoaDonTungThangModel";
import DichVuModel from "../models/DichVuModel"; // Thêm model dịch vụ
import UserModel from "../models/UserModel";     // Để gửi thông báo cho người dùng (giả sử đã có)
import PhongTroModel from "../models/PhongTroModel";

class ChiSoDongHoService {
    
    async createChiSoDongHo(_user_id: string, data: any) {
        try {
            const chisodongho = new ChiSoDongHoModel({
                id_phong: data.ma_phong,
                id_users: data.user_id,
                ngay_thang_nam: data.ngay_thang_nam,
                chi_so_dien: data.chi_so_dien,
                image_dong_ho_dien: data.image_dong_ho_dien
            });
            await chisodongho.save();
            await this.calculateAndSaveInvoice(data.ma_phong, data.ngay_thang_nam);
            console.log(' Thêm chỉ số đồng hồ thành công.');
        } catch (error) {
            console.error(' Lỗi khi thêm chỉ số đồng hồ:', error);
        }
    }

    // Tính toán và lưu hóa đơn hàng tháng
    async calculateAndSaveInvoice(id_phong: string, ngay_thang_nam: string) {
        try {
            const phongtro = await PhongTroModel.findOne({id_phong}); // Giả sử tiền phòng là 1 triệu
            if (!phongtro) {
                console.log(' Không tìm thấy phòng trọ.');
                return;
            }
            // Lấy chỉ số điện tháng hiện tại
            const chiSoHienTai = await ChiSoDongHoModel.findOne({ id_phong, ngay_thang_nam });
            if (!chiSoHienTai) {
                console.log(' Không tìm thấy chỉ số tháng hiện tại.');
                return;
            }

            // Lấy chỉ số điện tháng trước
            const date = new Date(ngay_thang_nam);
            const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

            const chiSoThangTruoc = await ChiSoDongHoModel.findOne({
                id_phong,
                ngay_thang_nam: {
                    $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
                    $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
                },
            });
            // Lấy thông tin các dịch vụ (nước, wifi)
            const dichVu = await DichVuModel.find()
            if(!dichVu){
                console.log(' Không tìm thấy dịch vụ.');
                return;
            }
            const tienNuoc = dichVu[0]?.tien_nuoc || 0;
            const tienWifi = dichVu[0]?.tien_wifi || 0;
            const tienDien = dichVu[0]?.tien_dien || 0;

            const chiSoThangTruocValue = chiSoThangTruoc ? chiSoThangTruoc.chi_so_dien : 0;
            const soDienTieuThu = chiSoHienTai.chi_so_dien - chiSoThangTruocValue;
            const tiendien = soDienTieuThu * tienDien;

          

            // Tính tổng tiền
            const tongTien = tienDien + tienNuoc + tienWifi + tiendien;

            // Tạo hóa đơn
            const hoaDon = new HoaDonTungThangModel({
                id_phong: chiSoHienTai.id_phong,
                id_users: chiSoHienTai.id_users,
                chi_so_dien_thang_nay: chiSoHienTai.chi_so_dien,
                chi_so_dien_thang_truoc: chiSoThangTruocValue,
                so_dien_tieu_thu: soDienTieuThu,
                tien_dien: tienDien,
                tien_phong: phongtro.gia_tien,
                tong_tien: tongTien,
                ngay_tao_hoa_don: new Date(),
            });

            await hoaDon.save();
            console.log(' Hóa đơn đã được tạo và lưu thành công.');

            // Gửi hóa đơn về cho người dùng
            await this.sendInvoiceToUser(chiSoHienTai.id_users, hoaDon);

        } catch (error) {
            console.error(' Lỗi khi tính toán và lưu hóa đơn:', error);
        }
    }

    // Hàm gửi hóa đơn cho người dùng (giả lập gửi thông báo)
    async sendInvoiceToUser(userId: string, hoaDon: any) {
        try {
            const user = await UserModel.findById(userId);
            if (user && user.email) {
                console.log(` Đã gửi hóa đơn tháng ${hoaDon.ngay_tao_hoa_don.getMonth() + 1}/${hoaDon.ngay_tao_hoa_don.getFullYear()} đến email: ${user.email}`);
                // Giả lập gửi email hoặc thông báo push
                // sendEmail(user.email, hoaDon);
            } else {
                console.log(' Không tìm thấy thông tin người dùng để gửi hóa đơn.');
            }
        } catch (error) {
            console.error(' Lỗi khi gửi hóa đơn cho người dùng:', error);
        }
    }
}

export default ChiSoDongHoService;
