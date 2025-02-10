import { Router } from 'express';
import {
	register,
	sendPassword,
	verifypassword,
	login,
	verifyEmail,
} from '../controllers/user';
import { UserLoginRequest, userRegisterRequest } from '../request/user.requet';
import { forgotPasswordValidator, LoginValidator, ResetPasswordValidator, VerifyEmailValidation } from '../middlewares/user.middleware';


const router = Router();

router.post('/register',userRegisterRequest, register);
router.post('/login',LoginValidator, login);
router.post('/verify_Email',VerifyEmailValidation, verifyEmail);
router.post('/resend-forgot-password',forgotPasswordValidator, sendPassword);
router.post('/reset-password',ResetPasswordValidator, verifypassword);

export default router;