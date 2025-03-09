import express from "express";
import { deleteHoaDonByID, getHoaDon, getHoaDonUser, taoHoaDon, updateHoaDon } from "../controllers/HoaDonTungThangController";
import { accessTokenValidatetor } from "../middlewares/user.middleware";

const routerThang = express.Router();

routerThang.post("/create", taoHoaDon);

routerThang.get("/getHoaDon", getHoaDon);
routerThang.get("/getHDUser/:id_user", getHoaDonUser);

routerThang.put("/update/:id", updateHoaDon);
routerThang.delete("/delete/:id", deleteHoaDonByID);



export default routerThang;