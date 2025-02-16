import { Router } from 'express';
import { getAllMess } from '../controllers/messagerControllers';
import { accessTokenValidatetor } from '../middlewares/user.middleware';

const routerMess = Router();

routerMess.get('/mess/:id_nguoi_nhan', accessTokenValidatetor, getAllMess);

export default routerMess;