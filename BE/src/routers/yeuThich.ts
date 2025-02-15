import { authorize } from './../middlewares/authorize.middleware';
import { accessTokenValidatetor } from './../middlewares/user.middleware';
import { Router } from 'express';

import { creatYeuThich, deleteYeuThich } from '../controllers/YeuThich';

const router = Router();
router.post('/create',accessTokenValidatetor,authorize('40'),creatYeuThich)
router.post('/delete/:id',accessTokenValidatetor,authorize('41'),deleteYeuThich)

export default router