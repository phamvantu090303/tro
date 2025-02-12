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
router.post('/update/:id', updateThietBi);
router.get('/getAll', getData);
router.delete('/delete/all', deleteAll);
router.delete('/delete/:id', deleteById);

export default router;