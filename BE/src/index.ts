import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/user";
import danhMucRouter from "./routers/danhMuc";
import thietBiRouter from "./routers/thietBi";
import cors from "cors";
import YeuThichRouter from "./routers/yeuThich";
import contractRoutes from "./routers/hopdong";
import routeImage from "./routers/Image";
import routerPhong from "./routers/phongTro";
import routeDichVu from "./routers/dichVu";
import mapRoutes from "./routers/map";
import routeHoaDon from "./routers/hoaDon";
import routeChiSoDongHo from "./routers/chiSoDongHo";
import RouteQuyen from "./routers/quyen";
import QuyenChucNangRouter from "./routers/quyenChucNang";
import initSocket from "./utils/socket";
import { createServer } from "http";
import routerMess from "./routers/messager";
import routerAdmin from "./routers/adminRouter";
import { saveEndOfDayData } from "./controllers/electricityController";
import router from "./routers/TinhTienDienIOT";
import schedule from "node-schedule";
dotenv.config();

const PORT = process.env.PORT || 3001;
const dbURL = `mongodb+srv://phamtu090303:gSPppVILdD2EJl4g@quanlyphongtro.k5jir.mongodb.net/?retryWrites=true&w=majority`;
// const dbURL = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@mongo:27017/${process.env.DB_NAME}?authSource=admin`;
const app = express();

const server = createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Địa chỉ của frontend
    credentials: true, // Cho phép gửi cookie
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/admin", routerAdmin);

app.use("/auth", userRouter);
app.use("/danh-muc", danhMucRouter);
app.use("/yeu-thich", YeuThichRouter);
app.use("/thiet-bi", thietBiRouter);
app.use("/Image-phong", routeImage);
app.use("/phongTro", routerPhong);
app.use("/dich-vu", routeDichVu);
app.use("/map", mapRoutes);
app.use("/hoadon", routeHoaDon);
app.use("/chi-so-dong-ho", routeChiSoDongHo);
app.use("/phan_quyen", RouteQuyen);
app.use("/quyenchucnang", QuyenChucNangRouter);

app.use("/tin-nhan", routerMess);


//hợp đồng
app.use("/api/contracts", contractRoutes);
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log(`Connect to db successfully!!!`);
  } catch (error) {
    console.log(`Can not connect to db ${error}`);
  }
};


// socket
initSocket(server);
app.use("/api", router);

// Lưu dữ liệu cuối ngày
schedule.scheduleJob("59 23 * * *", saveEndOfDayData);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is stating at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
