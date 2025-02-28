import { Request, Response } from "express";
import { PhongtroService } from "../services/PhongTroService";
import PhongTroModel from "../models/PhongTroModel";

const phongTroService = new PhongtroService();

const storePhongTro = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newPhongTro = await phongTroService.createPhongTro(body);
    res
      .status(201)
      .json({ message: "Tạo phòng trọ thành công!", data: newPhongTro });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi tạo phòng trọ!", error: error.message });
  }
};

const updatePhongTro = async (req: Request, res: Response) => {
  try {
    const { ma_phong } = req.params;
    const updateData = req.body;

    if (!ma_phong) {
      return res
        .status(400)
        .json({ message: "Mã phòng là bắt buộc để cập nhật." });
    }

    const updatedPhongTro = await phongTroService.updatePhongTro(
      ma_phong,
      updateData
    );

    if (!updatedPhongTro) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phòng trọ để cập nhật." });
    }

    res.status(200).json({
      message: "Cập nhật phòng trọ thành công!",
      data: updatedPhongTro,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật phòng trọ.", error: error.message });
  }
};

const getData = async (req: Request, res: Response) => {
  try {
    const data = await phongTroService.getAllPhongTro();
    console.log(data)
    res.status(200).json({
      message: "Lấy danh sách phòng trọ thành công!",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách phòng trọ.",
      error: error.message,
    });
  }
};

const deleteAll = async (req: Request, res: Response) => {
  try {
    await phongTroService.deleteAllPhongTro();
    res.status(200).json({ message: "Xóa tất cả phòng trọ thành công!" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa tất cả phòng trọ.", error: error.message });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const { ma_phong } = req.params;

    if (!ma_phong) {
      return res.status(400).json({ message: "Mã phòng là bắt buộc để xóa." });
    }

    const deletedPhongTro = await phongTroService.deletePhongTroById(ma_phong);

    if (!deletedPhongTro) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phòng trọ để xóa." });
    }

    res
      .status(200)
      .json({ message: "Xóa phòng trọ thành công!", data: deletedPhongTro });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phòng trọ.", error: error.message });
  }
};

const detailRoom = async (req: Request, res: Response) => {
  try {
    const { ma_phong } = req.params;
    const data = await phongTroService.getDetailPhongTro(ma_phong);
    res.status(200).json({
      message: "Lấy chi tiết danh sách phòng trọ thành công!",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách phòng trọ.",
      error: error.message,
    });
  }
};
const getPhongTroByMap = async (req: Request, res: Response) => {
  try {
    const { ma_map } = req.params;
    const data = await phongTroService.getPhongTroByMap(ma_map);
    res.status(200).json({
      message: "Lấy danh sách phòng trọ theo mã map thành công!",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách phòng trọ.",
      error: error.message,
    });
  }
}

export {
  storePhongTro,
  updatePhongTro,
  getData,
  deleteAll,
  deleteById,
  detailRoom,
  getPhongTroByMap
};
