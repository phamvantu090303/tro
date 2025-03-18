import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "./getAccesstoken";
import MessagerModel from "../models/MessagerModel";

class SocketMessager {
    private io: Server;
    private users: Record<string, string> = {};
    private admins: Record<string, string> = {};

    // Khởi tạo SocketMessager với server HTTP
    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        this.setupMiddleware();
        this.setupEvents();
    }

    // Hàm xác thực token từ client
    private async verifyAuthToken(socket: Socket): Promise<void> {
        const authHeader = socket.handshake.auth.Authorization;
        if (!authHeader) throw new Error("Không có accessToken");

        let token: string;
        let isAdminToken = false;

        // Xử lý token từ header Authorization
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else {
            token = authHeader;
            isAdminToken = true; // Giả định không có "Bearer" là token admin
        }

        if (!token) throw new Error("Token không hợp lệ!");

        let decodedAdmin, decodedUser; // Biến lưu thông tin giải mã token

        try {
            if (isAdminToken) {
                // Xác thực token admin
                decodedAdmin = await verifyToken(token, process.env.JWT_SECRET_ACCESS_TOKEN_ADMIN as string);
            } else {
                // Xác thực token user
                decodedUser = await verifyToken(token, process.env.JWT_SECRET_ACCESS_TOKEN as string);
            }
        } catch (error) {
            throw new Error("Token không hợp lệ!");
        }

        // Gán dữ liệu vào socket.data
        socket.data = {
            admin_id: decodedAdmin?._id,
            user_id: decodedUser?._id,
        };

        // Lưu socket ID vào danh sách tương ứng
        if (decodedAdmin?._id) {
            this.admins[decodedAdmin._id] = socket.id;
            console.log("Admin kết nối:", decodedAdmin._id);
        }
        if (decodedUser?._id) {
            this.users[decodedUser._id] = socket.id;
            console.log("Client kết nối:", decodedUser._id);
        }

        // Nếu không có ID nào được giải mã, token không hợp lệ
        if (!decodedAdmin?._id && !decodedUser?._id) {
            throw new Error("Token không hợp lệ!");
        }
    }

    // Thiết lập middleware để xác thực tất cả kết nối
    private setupMiddleware(): void {
        this.io.use(async (socket: Socket, next) => {
            try {
                await this.verifyAuthToken(socket);
                next();
            } catch (error) {
                console.error("Lỗi xác thực socket");
                next(error instanceof Error ? error : new Error("Lỗi xác thực"));
            }
        });
    }

    // Xử lý tin nhắn từ client
    private async handleMessage(socket: Socket, payload: {
        nguoi_gui: string;
        nguoi_nhan: string;
        noi_dung: string;
    }): Promise<void> {
        const { nguoi_gui, nguoi_nhan, noi_dung } = payload;

        // Kiểm tra dữ liệu đầu vào
        if (!nguoi_gui || !nguoi_nhan || !noi_dung?.trim()) {
            console.error("Dữ liệu tin nhắn không hợp lệ:", payload);
            return;
        }

        try {
            // Lưu tin nhắn vào database
            const message = await new MessagerModel({
                nguoi_gui,
                nguoi_nhan,
                noi_dung,
            }).save();

            // Gửi tin nhắn đến người nhận
            const adminSocketId = this.admins[nguoi_nhan];
            if (adminSocketId) {
                this.io.to(adminSocketId).emit("nhan_tin_nhan", { payload: message });
            }

            const userSocketId = this.users[nguoi_nhan];
            if (userSocketId && userSocketId !== adminSocketId) {
                this.io.to(userSocketId).emit("nhan_tin_nhan", { payload: message });
            }
        } catch (error) {
            console.error("Lỗi khi xử lý tin nhắn:", error);
        }
    }

    // Xử lý khi client ngắt kết nối
    private handleDisconnect(socket: Socket): void {
        const { admin_id, user_id } = socket.data;
        // Xóa socket ID khỏi danh sách nếu ngắt kết nối
        if (admin_id) {
            console.log(`Admin ${admin_id} đã ngắt kết nối`);
            delete this.admins[admin_id];
        }
        if (user_id) {
            console.log(`Người dùng ${user_id} đã ngắt kết nối`);
            delete this.users[user_id];
        }
    }

    // Thiết lập các sự kiện socket
    private setupEvents(): void {
        this.io.on("connection", (socket: Socket) => {
            // Lắng nghe sự kiện gửi tin nhắn từ client
            socket.on("gui_tin_nhan", (data: { payload: {
                nguoi_gui: string;
                nguoi_nhan: string;
                noi_dung: string;
            }}) => {
                this.handleMessage(socket, data.payload);
            });

            // Lắng nghe sự kiện ngắt kết nối
            socket.on("disconnect", () => {
                this.handleDisconnect(socket);
            });
        });
    }
}

const initSocket = (httpServer: HttpServer): SocketMessager => {
    return new SocketMessager(httpServer);
};

export default initSocket;