import { accessTokenValidatetor } from "./../middlewares/user.middleware";
import e, { Router } from "express";
import {
  createSuaChua,
  deleteSuaChua,
  getAllSuaChua,
  GetSuaChuaById,
  UpdateStatus,
  updateSuaChua,
} from "../controllers/SuaChuaController";
const routerSuaChua = Router();

routerSuaChua.post("/Create", accessTokenValidatetor, createSuaChua);
routerSuaChua.post("/Update/:id", updateSuaChua);
routerSuaChua.delete("/Delete/:id", deleteSuaChua);
routerSuaChua.get("/GetAll", getAllSuaChua);
routerSuaChua.get("/GetById", accessTokenValidatetor, GetSuaChuaById);
routerSuaChua.get("/UpdateStatus/:id", UpdateStatus);
export default routerSuaChua;
