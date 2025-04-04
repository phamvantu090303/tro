import { TransactionService } from "../services/nganHangService";

export const TransactionController = async (req: any, res: any) => {
    try {
      const result: string = await new TransactionService().TransactionData();
      res.status(200).json({
        message: result,
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Lỗi giao dịch",
        error: error.message
      });
    }
};
