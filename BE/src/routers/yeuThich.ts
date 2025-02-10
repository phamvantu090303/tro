import { Router } from 'express';

import { creatYeuThich, deleteYeuThich } from '../controllers/YeuThich';

const router = Router();
router.post('/create',creatYeuThich)
router.post('/delete/:id',deleteYeuThich)

export default router