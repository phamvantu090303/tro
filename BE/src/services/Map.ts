import MapModel from "../models/MapModel";

class MapService {
  async CreateMap(data: any) {
    const map = new MapModel({
      ma_map: data.ma_map,
      address: data.address,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      province: data.province,
      ward: data.ward,
    });
    await map.save();
  }

  async DeleteMap(_id: any) {
    await MapModel.findByIdAndDelete(_id);
  }

  async UpdateMap(id: any, updateData: any) {
    console.log("id", id);
    console.log("data update", updateData);
    await MapModel.findByIdAndUpdate(id, {
      ma_map: updateData.ma_map,
      address: updateData.address,
      district: updateData.district,
      latitude: updateData.latitude,
      longitude: updateData.longitude,
      province: updateData.province,
      ward: updateData.ward,
    });
  }

  async GetAllMap() {
    return await MapModel.find();
  }
}
export default MapService;
