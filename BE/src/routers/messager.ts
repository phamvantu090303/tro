import { Router } from 'express';
import { getAllMess, getAllMessAdmin } from '../controllers/messagerControllers';
import { accessTokenValidatetor } from '../middlewares/user.middleware';
import { accessTokenAdmin } from '../middlewares/admin.middleware';

const routerMess = Router();

routerMess.get('/mess/:id_nguoi_nhan', accessTokenValidatetor, getAllMess);
routerMess.get('/messAdmin/:id_nguoi_nhan', accessTokenAdmin, getAllMessAdmin);

export default routerMess;