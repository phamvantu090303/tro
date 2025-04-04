import axios from "axios";
import dotenv from "dotenv";
import HoaDonThanhToanModel from "../models/HoaDonThanhToanModel";
import PhongTroModel from "../models/PhongTroModel";

dotenv.config();
export class TransactionService {
  async TransactionData(): Promise<string> {
    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Lấy các thành phần
    const day = currentDate.getDate(); // Ngày (1-31)
    const month =
      currentDate.getMonth() + 1 < 9
        ? "0" + (currentDate.getMonth() + 1)
        : currentDate.getMonth() + 1; // Tháng (0-11, nên +1 để thành 1-12)
    const year = currentDate.getFullYear(); // Năm (ví dụ: 2025)

    // Định dạng thành chuỗi
    try {
      const formattedDate = `${day}/${month}/${year}`;
      // Gửi request lấy danh sách giao dịch
      const payload = {
        USERNAME: process.env.USERNAME_MB,
        // DAY_BEGIN: "19/03/2025",
        // DAY_END: "19/03/2025",
        DAY_BEGIN: formattedDate,
        DAY_END: formattedDate,
        NUMBER_MB: process.env.NUMBER_MB,
        PASSWORD: process.env.PASSWORD,
      };
      const response = await axios.post(
        "http://transaction.prodevecode.com:9658",
        payload
      );
      console.log("Dữ liệu trả về:", response.data);
      // Kiểm tra dữ liệu trả về
      const transactions = response.data;

      if (
        !transactions ||
        !Array.isArray(transactions) ||
        transactions.length === 0
      ) {
        return "Không có giao dịch nào trong ngày.";
      }
      console.log("Danh sách giao dịch:", transactions);

      let total = new Map<string, number>();
      transactions.forEach((value, key) => {
        if (value.addDescription.includes("HD")) {
          if (total.has(value.addDescription)) {
            total.set(
              value.addDescription,
              total.get(value.addDescription) + value.creditAmount
            );
          } else {
            total.set(value.addDescription, value.creditAmount);
          }
        }
      });
      for (const [key, value] of total) { //value đây là số tiền
        // console.log("key: ", key, "value: ", value);
        const cleanedKey = key.trim();

        const foundHoaDon = await HoaDonThanhToanModel.findOne({
          ma_don_hang: String(cleanedKey),
          // so_tien: value,
        });

        if (foundHoaDon) {
          // Nếu tổng tiền đã thanh toán >= số tiền cần thanh toán thì cập nhật trạng thái
          if (value >= foundHoaDon.so_tien) {
            foundHoaDon.trang_thai = "Đã thanh toán";
            foundHoaDon.ngay_chuyen_khoan = new Date();
            await foundHoaDon.save();

            const updatephong = await PhongTroModel.findOneAndUpdate(
              { ma_phong: foundHoaDon.ma_phong },
              { id_users: foundHoaDon.id_users },
              { new: true } // Return the updated document
            );

            if (updatephong) {
              console.log(`Updated PhongTro: ${updatephong}`);
            } else {
              console.log(
                `No PhongTro found for ma_phong: ${foundHoaDon.ma_phong}`
              );
            }
          } else {
            console.log(`No HoaDon found for ma_don_hang: ${cleanedKey}`);
          }
          console.log("foundHoaDon: ", foundHoaDon);
        }
      }
      return "Đã cập nhật thanh toán thành công!";
    } catch (error: any) {
      console.error("Lỗi trong quá trình xử lý giao dịch:", error.message);
      throw new Error(
        error.response?.data?.message || "Lỗi kết nối đến máy chủ giao dịch"
      );
    }
  }
}
