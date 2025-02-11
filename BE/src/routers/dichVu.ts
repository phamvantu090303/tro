import { Router } from "express";
import { CreateDichVu, DeleteDichVu, GetAllDichVu, UpdateDichVu } from "../controllers/dichVu";
const routeDichVu =Router()

routeDichVu.post('/Creat',CreateDichVu)
routeDichVu.delete('/Delete/:id',DeleteDichVu)
routeDichVu.post('/Update/:id',UpdateDichVu)
routeDichVu.get('/GetAll',GetAllDichVu)

export default routeDichVu;