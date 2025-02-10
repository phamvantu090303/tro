import { Router } from "express";
import {
  deleteAll,
  deleteById,
  detailRoom,
  getData,
  storePhongTro,
  updatePhongTro,
} from "../controllers/phongTro";

const routerPhong = Router();

routerPhong.post("/create", storePhongTro);
routerPhong.post("/update", updatePhongTro);
routerPhong.get("/get", getData);
routerPhong.post("/delete/all", deleteAll);
routerPhong.post("/delete/:ma_phong", deleteById);
routerPhong.post("detail/:ma_phong", detailRoom);
export default routerPhong;
