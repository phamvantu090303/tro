import { getDanhGiaChartData, getYeuThichChartData } from '../controllers/thongKeController';
import { Router } from 'express';

const routerThongKe = Router();
routerThongKe.get('/chart-yeu-tich', getYeuThichChartData);
routerThongKe.get('/chart-danh-gia', getDanhGiaChartData);

export default routerThongKe