import { Router } from 'express';
import {
	storeThietBi,
	updateThietBi,
	getData,
	deleteAll,
	deleteById,
} from '../controllers/thietBi';

const router = Router();

router.post('/create', storeThietBi);
router.post('/update', updateThietBi);
router.get('/', getData);
router.post('/delete/all', deleteAll);
router.post('/delete/:id', deleteById);

export default router;