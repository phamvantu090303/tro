import { Router } from "express";
import {
  getAllMess,
  getAllMessAdmin,
  getMessUser,
  getUnreadMessCountAdmin,
} from "../controllers/messagerControllers";
import { accessTokenValidatetor } from "../middlewares/user.middleware";
import { accessTokenAdmin } from "../middlewares/admin.middleware";

const routerMess = Router();

// routerMess.get("/mess/:id_nguoi_nhan", accessTokenValidatetor, getAllMess);
routerMess.get("/messAdmin/:id_nguoi_nhan", accessTokenAdmin, getAllMessAdmin);
routerMess.get("/messs", accessTokenValidatetor, getMessUser);

//đếm tin nhắn chưa đọc 
routerMess.get("/messAdmin/unread-count/:id_nguoi_nhan", accessTokenAdmin, getUnreadMessCountAdmin);
export default routerMess;
