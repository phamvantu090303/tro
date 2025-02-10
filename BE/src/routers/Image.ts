import { Router } from "express";
import { createImage, deleteAllImages, deleteImageById, getAllImages, updateImage } from "../controllers/ImagePhong";


 
const routeImage =Router();
routeImage.post('/creatImage',createImage)
routeImage.post('/Update',updateImage)
routeImage.get('/', getAllImages);
routeImage.get('/DeleteAll', deleteAllImages);
routeImage.post('/Delete/:id',deleteImageById)

 export default routeImage