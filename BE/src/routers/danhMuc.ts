import { accessTokenValidatetor } from './../middlewares/user.middleware';
import { Router } from 'express';
import {
	storeDanhMuc,
	updateDanhMuc,
	getData,
	deleteAll,
	deleteById,
} from '../controllers/danhMuc';
import { authorize } from '../middlewares/authorize.middleware';
const router = Router();

router.post('/create',accessTokenValidatetor,authorize('6'), storeDanhMuc);
router.post('/update/:id',accessTokenValidatetor,authorize('7'), updateDanhMuc);
router.get('/', getData);
router.post('/delete/all',accessTokenValidatetor,authorize('9'), deleteAll);
router.post('/delete/:id',accessTokenValidatetor,authorize('8'), deleteById);

export default router;