import { Router } from "express";
import {
  createImage,
  deleteAllImages,
  deleteImageById,
  getAllImages,
  updateImage,
} from "../controllers/ImagePhong";

const routeImage = Router();
routeImage.post("/create", createImage);
routeImage.post("/update/:ma_phong", updateImage);
routeImage.get("/getAll", getAllImages);
routeImage.delete("/delete/all", deleteAllImages);
routeImage.delete("/delete/:id", deleteImageById);

export default routeImage;
