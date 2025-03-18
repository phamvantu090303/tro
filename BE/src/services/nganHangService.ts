import axios from 'axios';
import dotenv from 'dotenv';
import NganHangModel from '../models/nganHangModel';

dotenv.config();

export class TransactionService {
  async TransactionData(data: any): Promise<any> {
    try {
      const response = await axios.post('http://transaction.prodevecode.com:9658', {
        USERNAME: process.env.USERNAME,
        DAY_BEGIN: process.env.DAY_BEGIN,
        DAY_END: process.env.DAY_END,
        NUMBER_MB: process.env.NUMBER_MB,
        PASSWORD: process.env.PASSWORD
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const newTransaction = new NganHangModel({
        ngayGiaoDich: response.data.data.transactionDate,
        soTaiKhoan: response.data.data.accountNo,
        soTienGhi: response.data.data.creditAmount,
        tienTe: response.data.data.currency,
        moTa: response.data.data.description
      });

      await newTransaction.save();

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi kết nối đến máy chủ giao dịch');
    }
  }

  async getTransaction(): Promise<any[]> {
    const data = await NganHangModel.find();
    return data;
  }
}