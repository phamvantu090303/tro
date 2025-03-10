import { accessTokenAdmin } from "./../middlewares/admin.middleware";
import { Router } from "express";
import {
  register,
  sendPassword,
  verifypassword,
  login,
  verifyEmail,
  getMe,
  getAllUser,
  updateUser,
  getDetailUser,
} from "../controllers/user";
import { UserLoginRequest, userRegisterRequest } from "../request/user.requet";
import {
  accessTokenValidatetor,
  forgotPasswordValidator,
  LoginValidator,
  ResetPasswordValidator,
  VerifyEmailValidation,
} from "../middlewares/user.middleware";

const router = Router();

router.post("/register", userRegisterRequest, register);
router.post("/login", LoginValidator, login);
router.post("/verify_Email", VerifyEmailValidation, verifyEmail);
router.post("/resend-forgot-password", forgotPasswordValidator, sendPassword);
router.post("/reset-password", ResetPasswordValidator, verifypassword);
router.get("/Detail/:id", getDetailUser);
router.post("/update/:id", accessTokenValidatetor, updateUser);
router.get("/me", accessTokenValidatetor, getMe);
router.get("/AllUser", getAllUser);

export default router;
