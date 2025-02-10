import ThietBiModal from '../models/ThietBiModel';

export class ThietBiService {
    // Tạo mới một thiết bị
    async createThietBi(body: any): Promise<void> {
        const { ten_thiet_bi, so_luong_thiet_bi, trang_thai } = body;

        // Tạo mới thiết bị
        const newThietBi = new ThietBiModal({
            ten_thiet_bi,
            so_luong_thiet_bi,
            trang_thai
        });

        // Lưu thiết bị vào cơ sở dữ liệu
        await newThietBi.save();
    }

    // Cập nhật thông tin thiết bị
    async updateThietBi(body: any): Promise<void> {
        const { id, ten_thiet_bi, so_luong_thiet_bi, trang_thai } = body;

        // Kiểm tra thiết bị cần cập nhật có tồn tại không
        const thietBi = await ThietBiModal.findById(id);
        if (!thietBi) {
            throw new Error('Thiết bị không tồn tại');
        }

        // // Cập nhật thông tin thiết bị
        thietBi.ten_thiet_bi = ten_thiet_bi ?? thietBi.ten_thiet_bi;
        thietBi.so_luong_thiet_bi = so_luong_thiet_bi ?? thietBi.so_luong_thiet_bi;
        thietBi.trang_thai = trang_thai ?? thietBi.trang_thai;

        // Lưu các thay đổi vào cơ sở dữ liệu
        await thietBi.save();
    }


    //Lấy danh sách dữu liệu thiết bị
    async getDataThietBi(): Promise<any[]> {
        // Sử dụng `find()` để lấy tất cả dữ liệu thiết bị
        const thietBi = await ThietBiModal.find();

        // Trả về kết quả
        return thietBi;
    }


    async deleteAllThietBi(body:any): Promise<void> {
        // Sử dụng `find()` để lấy tất cả dữ liệu thiết bị
        await ThietBiModal.find();

    }

    async deleteByIdaThietBi(body:any): Promise<void> {
        const { id } = body;
        const thietBi = await ThietBiModal.findById(id);
        if (!thietBi) {
            throw new Error('Thiết bị không tồn tại');
        }

        // Xóa thiết bị
        await ThietBiModal.findByIdAndDelete(id);
    }
}
