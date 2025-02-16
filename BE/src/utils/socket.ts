import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "./getAccesstoken";
import MessagerModel from "../models/MessagerModel";

const initSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: "http://localhost:3000" },
    });

    const users: Record<string, string> = {};

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.Authorization?.split(" ")[1];
            if (!token) return next(new Error("Không có accessToken"));

            const decoded = await verifyToken(token, process.env.JWT_SECRET_ACCESS_TOKEN as string);
            if (!decoded?._id) return next(new Error("Token không hợp lệ!"));

            socket.data.user_id = decoded._id;
            users[decoded._id] = socket.id;

            console.log("Người dùng kết nối:", decoded._id);
            next();
        } catch (error) {
            console.error("Lỗi xác thực:", error);
            next(new Error("Token không hợp lệ!"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const user_id = socket.data.user_id;

        socket.on("gui_tin_nhan", async ({ payload }) => {
            try {
                const { nguoi_gui, nguoi_nhan, noi_dung } = payload;

                if (!nguoi_gui || !nguoi_nhan || !noi_dung.trim()) {
                    return console.error("Dữ liệu tin nhắn không hợp lệ");
                }

                const message = await new MessagerModel({ nguoi_gui, nguoi_nhan, noi_dung }).save();
                console.log("Tin nhắn đã lưu:", message);

                const receiverSocketId = users[nguoi_nhan];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("nhan_tin_nhan", { payload: message });
                }
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Người dùng ${user_id} đã ngắt kết nối`);
            delete users[user_id];
        });
    });
};

export default initSocket;
