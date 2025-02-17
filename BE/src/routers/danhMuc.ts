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


router.post('/create',accessTokenValidatetor,authorize('67b1dfa48631e4849450bbb4'), storeDanhMuc);
router.post('/update/:id',accessTokenValidatetor,authorize('67b1dfa48631e4849450bbb5'), updateDanhMuc);
router.get('/', getData);
router.post('/delete/all',accessTokenValidatetor,authorize('67b1dfa48631e4849450bbb7'), deleteAll);
router.post('/delete/:id',accessTokenValidatetor,authorize('67b1dfa48631e4849450bbb6'), deleteById);


export default router;