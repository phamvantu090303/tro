import { Router } from "express";
import { CreateDichVu, DeleteDichVu, GetAllDichVu, UpdateDichVu } from "../controllers/dichVu";
const routeDichVu =Router()

routeDichVu.post('/creat',CreateDichVu)
routeDichVu.delete('/delete/:id',DeleteDichVu)
routeDichVu.post('/update/:id',UpdateDichVu)
routeDichVu.get('/getAll',GetAllDichVu)

export default routeDichVu;