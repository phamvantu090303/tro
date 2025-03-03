import { Request, Response } from "express";
import MapService from "../services/Map";

export const CreateMap = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const mapServiceInstance = new MapService();
    await mapServiceInstance.CreateMap(data);

    res.status(200).json({
      message: "Create successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};
export const UpdateMap = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const formData = req.body;
    const mapServiceInstance = new MapService();
    await mapServiceInstance.UpdateMap(id, formData);

    res.status(200).json({
      message: "Update successfully!!!",
      id: id,
      data: formData,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const DeleteMap = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const mapServiceInstance = new MapService();
    await mapServiceInstance.DeleteMap(id);

    res.status(200).json({
      message: "Delete successfully!!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const GetAllMap = async (req: Request, res: Response) => {
  try {
    const mapServiceInstance = new MapService();
    const data = await mapServiceInstance.GetAllMap();

    res.status(200).json({
      message: "GetAll successfully!!!",
      data: data,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};
