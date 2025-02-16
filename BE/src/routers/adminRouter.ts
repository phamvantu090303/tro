import { Router } from 'express';
import { createAdmin, deleteAdmin, getAdmin, getAllAdmin, loginAdmin, resetPasswordAdmin, sendPasswordAdmin, updateAdmin } from '../controllers/adminController';
import { accessTokenAdmin, forgotPasswordAdmin, LoginAdminValidator, ResetPasswordAdmin } from '../middlewares/admin.middleware';

const routerAdmin = Router();

routerAdmin.post('/login', LoginAdminValidator, loginAdmin);

routerAdmin.post('/create', createAdmin);
routerAdmin.post('/update/:id', accessTokenAdmin, updateAdmin);
routerAdmin.delete('/delete/:id', deleteAdmin);

routerAdmin.post('/resend-forgot-password', forgotPasswordAdmin, sendPasswordAdmin);
routerAdmin.post('/reset-password', ResetPasswordAdmin, resetPasswordAdmin);

routerAdmin.get('/getadmin', accessTokenAdmin, getAdmin);
routerAdmin.get('/AllUser', getAllAdmin);

export default routerAdmin;