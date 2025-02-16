import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel"; // Import model User

const authMiddleware = async (req: any, res: any, next: any) => {
    try {
        // Lấy token từ headers
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }

        // Giải mã token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại!" });
        }

        // Kiểm tra xác thực email
        if (!user.verify) {
            return res.status(403).json({ message: "Vui lòng xác thực email trước khi thuê phòng!" });
        }

        req.user = user; // Lưu thông tin user vào request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ!" });
    }
};

export default authMiddleware;
