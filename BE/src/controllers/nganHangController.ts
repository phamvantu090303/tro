import { TransactionService } from "../services/nganHangService";

export const TransactionController = async (req: any, res: any) => {
    try {
      const transactionService = new TransactionService();
      const result = await transactionService.TransactionData({});

      res.status(200).json({
        message: 'Thành công',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Lỗi giao dịch"
      });
    }
};

export const TransactionData = async (req: any, res: any) => {
    try {
      const transactionService = new TransactionService();
      const result = await transactionService.getTransaction();

      res.status(200).json({
        message: 'Thành công',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Lỗi giao dịch"
      });
    }
};