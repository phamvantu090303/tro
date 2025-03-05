import dotenv from 'dotenv';
import { ThietBiService } from '../services/ThietBiService';
dotenv.config();
const thietBiService = new ThietBiService();
const storeThietBi = async (req: any, res: any) => {
    try {
   
        await thietBiService.createThietBi(req.body);

        res.status(201).json({
            message: 'Thiết bị đã được tạo thành công',
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};


const updateThietBi = async (req: any, res: any) => {
    try {
        const _id = req.params;
        const data = req.body;
   
        await thietBiService.updateThietBi(_id, data);

        res.status(200).json({
            message: 'Thiết bị đã được cập nhật thành công',
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};


const getData = async (req: any, res: any) => {
    try {
   
        const data = await thietBiService.getDataThietBi();

        res.status(200).json({
            status: '200',
            data,
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const deleteAll = async (req: any, res: any) => {
    try{
   
        await thietBiService.deleteAllThietBi()
            res.status(200).json({
                status: "200",
                message: "Đã xóa tất cả thiết bị thành công!"
            });
        } catch(error: any) {
            res.status(404).json({
                message: error.message,
            });
        }
}

const deleteById = async (req: any, res: any) => {
    try {
   
        await thietBiService.deleteByIdaThietBi(req.params);

        res.status(200).json({
            message: 'Thiết bị đã được xóa thành công',
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export { storeThietBi, updateThietBi, getData, deleteAll, deleteById }