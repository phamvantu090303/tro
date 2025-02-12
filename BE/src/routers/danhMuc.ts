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
router.get('/getAll', getData);
router.delete('/delete/all', deleteAll);
router.delete('/delete/:id', deleteById);

export default router;