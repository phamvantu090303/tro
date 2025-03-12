import { Router } from "express";
import {
  storeThietBi,
  updateThietBi,
  getData,
  deleteAll,
  deleteById,
} from "../controllers/thietBi";
import { authorize } from "../middlewares/authorize.middleware";
import { accessTokenAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.post("/create", accessTokenAdmin, storeThietBi);
router.post("/update/:id", accessTokenAdmin, updateThietBi);
router.get("/all", getData);
router.delete("/delete/all", accessTokenAdmin, deleteAll);
router.delete("/delete/:id", accessTokenAdmin, deleteById);

export default router;
