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

  async UpdateMap(data: any) {
    await MapModel.findByIdAndUpdate(data.id, {
      ma_map: data.ma_map,
      address: data.address,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      province: data.province,
      ward: data.ward,
    });
  }

  async GetAllMap() {
    return await MapModel.find();
  }
}
export default MapService;
