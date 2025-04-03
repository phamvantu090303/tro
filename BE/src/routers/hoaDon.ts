import { Router} from 'express';
import { CreateHoaDon, deleteHoadon, DetaijHoaDon, getAllHoaDon } from '../controllers/hoaDon';
import { accessTokenValidatetor } from '../middlewares/user.middleware';
import { accessTokenAdmin } from '../middlewares/admin.middleware';
const routeHoaDon = Router();

routeHoaDon.post('/Create',accessTokenValidatetor,CreateHoaDon)

//admin
routeHoaDon.get('/GetAll',getAllHoaDon)
routeHoaDon.get('/Delete/:id',deleteHoadon)
routeHoaDon.get('/detail/hoadon/:id',DetaijHoaDon)


export default routeHoaDon; 