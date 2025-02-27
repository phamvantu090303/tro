import {Router} from 'express';
const routerDanhGia = Router();
import { accessTokenValidatetor } from '../middlewares/user.middleware';
import { createDanhGia, DeleteDanhGia, getDataDanhGia } from '../controllers/danhGiaController';

routerDanhGia.post('/createdanhgia',accessTokenValidatetor, createDanhGia);
routerDanhGia.get('/getdanhgia/:ma_phong',accessTokenValidatetor, getDataDanhGia);
routerDanhGia.post('/deletedanhgia/:id',accessTokenValidatetor, DeleteDanhGia);
export default routerDanhGia;