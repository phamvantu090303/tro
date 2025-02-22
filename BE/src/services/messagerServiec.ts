import { ObjectId } from 'mongodb';
import MessagersModel from "../models/MessagerModel";

class MessagersService {
    async messAll(id_nguoi_gui: string, id_nguoi_nhan: string) {
        return await MessagersModel.find({
            $or: [
                { nguoi_gui: new ObjectId(id_nguoi_gui), nguoi_nhan: new ObjectId(id_nguoi_nhan) },
                { nguoi_gui: new ObjectId(id_nguoi_nhan), nguoi_nhan: new ObjectId(id_nguoi_gui) }
            ]
        }).sort({ createdAt: 1 });
    }

    async messAllAdmin(id_nguoi_gui: string, id_nguoi_nhan: string) {
        return await MessagersModel.find({
            $or: [
                { nguoi_gui: new ObjectId(id_nguoi_gui), nguoi_nhan: new ObjectId(id_nguoi_nhan) },
                { nguoi_gui: new ObjectId(id_nguoi_nhan), nguoi_nhan: new ObjectId(id_nguoi_gui) }
            ]
        }).sort({ createdAt: 1 });
    }
}
export default MessagersService;