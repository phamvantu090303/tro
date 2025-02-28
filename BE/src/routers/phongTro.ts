import { Router } from "express";
import {
  deleteAll,
  deleteById,
  detailRoom,
  getData,
  getPhongTroByMap,
  storePhongTro,
  updatePhongTro,
} from "../controllers/phongTro";

const routerPhong = Router();

routerPhong.post("/create", storePhongTro);
routerPhong.post("/update/:ma_phong", updatePhongTro);
routerPhong.get("/get", getData);
routerPhong.delete("/delete/all", deleteAll);
routerPhong.delete("/delete/:ma_phong", deleteById);

routerPhong.post("/detail/:ma_phong", detailRoom);
//lấy phòng theo mã map
routerPhong.post("/getPhongByMaMap/:ma_map", getPhongTroByMap);
export default routerPhong;
