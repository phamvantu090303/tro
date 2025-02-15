import { Router} from 'express';
const mapRoutes = Router();
import { CreateMap, DeleteMap, GetAllMap, UpdateMap } from "../controllers/map";

mapRoutes.post('/creatMap',CreateMap);       // Tạo mới bản đồ
mapRoutes.get('/AllMap', GetAllMap);       // Lấy tất cả bản đồ
mapRoutes.put('/updateMap', UpdateMap);    // Cập nhật bản đồ
mapRoutes.delete('/deleteMap/:id', DeleteMap); // Xóa bản đồ

 export default mapRoutes;
