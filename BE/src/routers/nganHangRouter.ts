import {Router} from 'express'
import { TransactionController } from '../controllers/nganHangController'
const nganHangRouter=Router()


nganHangRouter.post('/transaction', TransactionController)
nganHangRouter.get('/transactionDât', TransactionController)

export default nganHangRouter