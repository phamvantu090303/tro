import { Router} from 'express';
import { CreateHoaDon } from '../controllers/hoaDon';
import { accessTokenValidatetor } from '../middlewares/user.middleware';
const routeHoaDon = Router();

routeHoaDon.post('/Create',accessTokenValidatetor,CreateHoaDon)

export default routeHoaDon; 