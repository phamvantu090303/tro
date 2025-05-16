import { ObjectId } from "mongodb";
import MessagersModel from "../models/MessagerModel";

class MessagersService {
  async messAll(id_nguoi_gui: string, id_nguoi_nhan: string) {
    return await MessagersModel.find({
      $or: [
        {
          nguoi_gui: new ObjectId(id_nguoi_gui),
          nguoi_nhan: new ObjectId(id_nguoi_nhan),
        },
        {
          nguoi_gui: new ObjectId(id_nguoi_nhan),
          nguoi_nhan: new ObjectId(id_nguoi_gui),
        },
      ],
    }).sort({ createdAt: 1 });
  }

  async messAllAdmin(id_nguoi_gui: string, id_nguoi_nhan: string) {
    return await MessagersModel.find({
      $or: [
        {
          nguoi_gui: new ObjectId(id_nguoi_gui),
          nguoi_nhan: new ObjectId(id_nguoi_nhan),
        },
        {
          nguoi_gui: new ObjectId(id_nguoi_nhan),
          nguoi_nhan: new ObjectId(id_nguoi_gui),
        },
      ],
    }).sort({ createdAt: 1 });
  }
  async messUser(id_nguoi_gui: string, id_nguoi_nhan: string) {
    return await MessagersModel.find({
      $or: [
        {
          nguoi_gui: new ObjectId(id_nguoi_gui),
          nguoi_nhan: new ObjectId(id_nguoi_nhan),
        },
        {
          nguoi_gui: new ObjectId(id_nguoi_nhan),
          nguoi_nhan: new ObjectId(id_nguoi_gui),
        },
      ],
    }).sort({ createdAt: 1 });
  }
  async getdemtinnhan(nguoi_nhan: string) {
    const count = await MessagersModel.countDocuments({
      nguoi_nhan: new ObjectId(nguoi_nhan),
      is_read: false,
    });
    return count;
  }

  // tin nhắn là đã đọc
  async doctinnhanService(nguoi_nhan: string) {
    const result = await MessagersModel.updateMany(
      {
        nguoi_nhan: new ObjectId(nguoi_nhan),
        is_read: false,
      },
      {
        $set: { is_read: true },
      }
    );

    return result.modifiedCount;
  }
}
export default MessagersService;
