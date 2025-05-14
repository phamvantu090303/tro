import { UpdatIs_Block } from './../controllers/adminController';
import { Router } from "express";
import {
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAllAdmin,
  loginAdmin,
  logoutAdmin,
  resetPasswordAdmin,
  sendPasswordAdmin,
  updateAdmin,
} from "../controllers/adminController";
import {
  accessTokenAdmin,
  forgotPasswordAdmin,
  LoginAdminValidator,
  ResetPasswordAdmin,
} from "../middlewares/admin.middleware";

const routerAdmin = Router();

routerAdmin.post("/login", LoginAdminValidator, loginAdmin);

routerAdmin.post("/create", createAdmin);
routerAdmin.post("/update/:id", accessTokenAdmin, updateAdmin);
routerAdmin.post("/is_block/:id", accessTokenAdmin, UpdatIs_Block);
routerAdmin.delete("/delete/:id", deleteAdmin);

routerAdmin.post(
  "/resend-forgot-password",
  forgotPasswordAdmin,
  sendPasswordAdmin
);
routerAdmin.post("/reset-password", ResetPasswordAdmin, resetPasswordAdmin);
routerAdmin.post("/logout", logoutAdmin);

routerAdmin.get("/getadmin", accessTokenAdmin, getAdmin);
routerAdmin.get("/getAll", getAllAdmin);

export default routerAdmin;
