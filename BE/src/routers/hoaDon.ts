import { Router } from "express";
import {
  CreateHoaDon,
  deleteHoadon,
  DetaijHoaDon,
  getAllHoaDon,
} from "../controllers/hoaDon";
import { accessTokenValidatetor } from "../middlewares/user.middleware";
const routeHoaDon = Router();

routeHoaDon.post("/create", accessTokenValidatetor, CreateHoaDon);

//admin
routeHoaDon.get("/getAll", getAllHoaDon);
routeHoaDon.delete("/delete/:id", deleteHoadon);
routeHoaDon.get("/detail/:id", DetaijHoaDon);

export default routeHoaDon;
