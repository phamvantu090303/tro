import { Router } from 'express';

import { creatYeuThich, deleteYeuThich, getDataYeuThich } from '../controllers/YeuThich';

const router = Router();
router.post('/create',creatYeuThich)
router.delete('/delete/:id',deleteYeuThich)
router.get('/getAll', getDataYeuThich)


export default router