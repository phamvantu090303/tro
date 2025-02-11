import { Router } from 'express';
import {
	storeDanhMuc,
	updateDanhMuc,
	getData,
	deleteAll,
	deleteById,
} from '../controllers/danhMuc';

const router = Router();

router.post('/create', storeDanhMuc);
router.post('/update/:id', updateDanhMuc);
router.get('/', getData);
router.post('/delete/all', deleteAll);
router.post('/delete/:id', deleteById);

export default router;