import {Router} from 'express'
import { TransactionController } from '../controllers/nganHangController'
const nganHangRouter=Router()


nganHangRouter.post('/transaction', TransactionController)

export default nganHangRouter