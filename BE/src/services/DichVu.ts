import DichVuModel from "../models/DichVuModel";

class DichVuService {
  async CreatDichVu(data: any) {
    const dichVu = new DichVuModel({
       tien_dien: data.tien_dien,
      tien_nuoc: data.tien_nuoc,
      tien_wifi:  data.tien_wifi,
    });
    await dichVu.save();
  }

  async DeleteDichVu(_id: any) {
    await DichVuModel.findByIdAndDelete(_id);
  }

  async UpdateDichVu(data: any) {
    await DichVuModel.findByIdAndUpdate(data.id, {
      tien_dien: data.tien_dien,
      tien_nuoc: data.tien_nuoc,
      tien_wifi: data.tien_wifi,
    });
  }
  
  async GetAllDichVu() {
    return await DichVuModel.find();
  }
}
export default DichVuService;
