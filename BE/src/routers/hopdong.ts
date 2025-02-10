import express from 'express';
import { createContract, customer } from '../controllers/hopDong';
import { accessTokenValidatetor } from '../middlewares/user.middleware';
const router = express.Router();


router.get('/customer',accessTokenValidatetor,customer);
router.post('/create',accessTokenValidatetor, createContract);
// router.get('detail/:id_phong',DetailRoom)

export default router;