import { Router } from 'express';
import {
	storeThietBi,
	updateThietBi,
	getData,
	deleteAll,
	deleteById,
} from '../controllers/thietBi';
import { accessTokenValidatetor } from '../middlewares/user.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

router.post('/create',accessTokenValidatetor,authorize('33'), storeThietBi);
router.post('/update/:id',accessTokenValidatetor,authorize('34'), updateThietBi);
router.get('/',accessTokenValidatetor,authorize('32'), getData);
router.post('/delete/all',accessTokenValidatetor,authorize('36'), deleteAll);
router.post('/delete/:id',accessTokenValidatetor,authorize('35'), deleteById);

export default router;