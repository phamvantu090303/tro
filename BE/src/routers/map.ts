import { Router } from "express";
const mapRoutes = Router();
import { CreateMap, DeleteMap, GetAllMap, UpdateMap } from "../controllers/map";
import { accessTokenAdmin } from "../middlewares/admin.middleware";
import { authorize } from "../middlewares/authorize.middleware";

mapRoutes.post("/creatMap",accessTokenAdmin,authorize("67b1dfa48631e4849450bbd4"), CreateMap); // Tạo mới bản đồ
mapRoutes.get("/AllMap",accessTokenAdmin,authorize("67b1dfa48631e4849450bbd7"), GetAllMap); // Lấy tất cả bản đồ
mapRoutes.post("/updateMap/:id",accessTokenAdmin,authorize("67b1dfa48631e4849450bbd5"), UpdateMap); // Cập nhật bản đồ
mapRoutes.delete("/deleteMap/:id",accessTokenAdmin,authorize("67b1dfa48631e4849450bbd6"), DeleteMap); // Xóa bản đồ

export default mapRoutes;
