import { authorize } from './../middlewares/authorize.middleware';
import { accessTokenValidatetor } from './../middlewares/user.middleware';
import { Router } from 'express';

import { creatYeuThich, deleteYeuThich, getALLYeuThich, getDataYeuThich } from '../controllers/YeuThich';

const router = Router();
router.post('/create',creatYeuThich)
router.delete('/delete/:id', deleteYeuThich)

router.get('/getdata/:id_user', getDataYeuThich)
router.get('/getAll', getALLYeuThich)

export default router