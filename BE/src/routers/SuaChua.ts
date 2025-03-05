import { accessTokenValidatetor } from './../middlewares/user.middleware';
import e, { Router } from "express";
import { createSuaChua, deleteSuaChua, getAllSuaChua, GetSuaChuaById, UpdateStatus, updateSuaChua } from "../controllers/SuaChuaController";
const routerSuaChua = Router();

routerSuaChua.post("/Create",accessTokenValidatetor,createSuaChua );
routerSuaChua.post("/Update/:id",accessTokenValidatetor,updateSuaChua );
routerSuaChua.delete("/Delete/:id",accessTokenValidatetor,deleteSuaChua );
routerSuaChua.get("/GetAll",accessTokenValidatetor,getAllSuaChua );
routerSuaChua.get("/GetById",accessTokenValidatetor,GetSuaChuaById );
routerSuaChua.get("/UpdateStatus/:id",accessTokenValidatetor,UpdateStatus );
export default routerSuaChua;


