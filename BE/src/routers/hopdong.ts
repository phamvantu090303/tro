import express from 'express';
import { createContract, customer, extendContract } from '../controllers/hopDong';
import { accessTokenValidatetor } from '../middlewares/user.middleware';
const router = express.Router();


router.get('/customer',accessTokenValidatetor,customer);
router.post('/create',accessTokenValidatetor, createContract);
router.get('gia_han_hop_dong/:ma_phong',extendContract)

export default router;