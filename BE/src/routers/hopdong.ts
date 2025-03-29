import express from "express";
import {
  createContract,
  customer,
  detailContract,
  extendContract,
} from "../controllers/hopDong";
import { accessTokenValidatetor } from "../middlewares/user.middleware";
const router = express.Router();

router.get("/customer", accessTokenValidatetor, customer);
router.post("/create", accessTokenValidatetor, createContract);
router.get("gia_han_hop_dong/:ma_phong", extendContract);
router.get("/detail", accessTokenValidatetor, detailContract);
export default router;
