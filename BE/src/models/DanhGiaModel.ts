import { ObjectId } from 'mongodb';
import mongoose, { Schema } from "mongoose";

const DanhGiaSchema = new Schema(
  {
    ma_phong: {
        type : String,
        require: true
    },
    id_user: {
        type : ObjectId,
        require: true
    },
    repcomment: {
        type : ObjectId,
        default: null
    },
    noi_dung: {
        type : String,
        require: true
    },

  },
  { timestamps: true }
);

const DanhGiaModel = mongoose.model("danh_gia", DanhGiaSchema);
export default DanhGiaModel;
