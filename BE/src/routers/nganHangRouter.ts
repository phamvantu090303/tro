import {Router} from 'express'
import { TransactionController, TransactionData } from '../controllers/nganHangController'
const nganHangRouter=Router()


nganHangRouter.post('/transaction', TransactionController)
nganHangRouter.get('/transactionData', TransactionData)

export default nganHangRouter