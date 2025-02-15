import {Router} from 'express'
import { CreatQuyenChucNang } from '../controllers/quyenChucNang'
const  QuyenChucNangRouter =Router()

QuyenChucNangRouter.post('/CreatQuyen',CreatQuyenChucNang)

export default QuyenChucNangRouter
