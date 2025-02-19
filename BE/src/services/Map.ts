import MapModel from "../models/MapModel";

class MapService {
  
  async CreateMap(data: any) {
    const map = new MapModel({
      address: data.address,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      province: data.province,
      ward: data.ward
    });
    await map.save();
  }

  async DeleteMap(_id: any) {
    await MapModel.findByIdAndDelete(_id);
  }

  async UpdateMap(_id:string,data: any) {
    const updateMap =await MapModel.findByIdAndUpdate(_id,data,{new :true})
    return updateMap
  }

  async GetAllMap() {
    return await MapModel.find();
  }
}
export default MapService;