import { authorize } from './../middlewares/authorize.middleware';
import { accessTokenValidatetor } from './../middlewares/user.middleware';
import { Router } from 'express';

import { creatYeuThich, deleteYeuThich, getDataYeuThich } from '../controllers/YeuThich';

const router = Router();
router.post('/create',creatYeuThich)
router.post('/delete/:id', deleteYeuThich)

router.get('/getdata', getDataYeuThich)

export default router