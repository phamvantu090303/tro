import { Router } from 'express';
import {
	storeDanhMuc,
	updateDanhMuc,
	getData,
	deleteAll,
	deleteById,
} from '../controllers/danhMuc';
import { authorize } from '../middlewares/authorize.middleware';
import { accessTokenAdmin } from '../middlewares/admin.middleware';
const router = Router();


router.post('/create',accessTokenAdmin,authorize('67b1dfa48631e4849450bbb4'), storeDanhMuc);
router.post('/update/:id',accessTokenAdmin,authorize('67b1dfa48631e4849450bbb5'), updateDanhMuc);
router.get('/', getData);
router.post('/delete/all',accessTokenAdmin,authorize('67b1dfa48631e4849450bbb7'), deleteAll);
router.post('/delete/:id',accessTokenAdmin,authorize('67b1dfa48631e4849450bbb6'), deleteById);


export default router;