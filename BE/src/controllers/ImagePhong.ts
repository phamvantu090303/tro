import { Request, Response } from "express";
import { ImageService } from "../services/ImagePhongService";

const createImage = async (req: Request, res: Response) => {
    const { id_phong_tro, image_url } = req.body;
    try {
        const imageService = new ImageService();
        await imageService.createImage({ id_phong_tro, image_url });

        res.status(200).json({
            message: 'Hình ảnh đã được tạo thành công',
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const updateImage = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const imageService = new ImageService();
        await imageService.updateImage(data);

        res.status(200).json({
            message: 'Hình ảnh đã được cập nhật thành công',
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllImages = async (req: Request, res: Response) => {
    try {
        const imageService = new ImageService();
        const images = await imageService.getAllImages();

        res.status(200).json({
            status: "200",
            data: images,
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const deleteAllImages = async (req: Request, res: Response) => {
    try {
        const imageService = new ImageService();
        await imageService.deleteAllImages();

        res.status(200).json({
            status: "200",
            message: "Tất cả hình ảnh đã được xóa thành công!",
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const deleteImageById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const imageService = new ImageService();
        await imageService.deleteImageById(id);

        res.status(200).json({
            status: "200",
            message: "Hình ảnh đã được xóa thành công!",
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export { createImage, updateImage, getAllImages, deleteAllImages, deleteImageById };
