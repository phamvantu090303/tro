import {Router} from 'express'
import { deleteQuyen, getQuyen, storeQuyen, updateQuyen } from '../controllers/quyen';
const RouteQuyen = Router();


RouteQuyen.post('/CreatQuyen',storeQuyen)
RouteQuyen.post('/UpdateQuyen/:id',updateQuyen)
RouteQuyen.post('/DeleteQuyen/:id',deleteQuyen)
RouteQuyen.get('/AllQuyen',getQuyen)

export default RouteQuyen