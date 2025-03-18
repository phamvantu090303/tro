import mongoose, { Schema } from 'mongoose';

const NganHangSchema = new Schema(
    {
        //transaction Date
        ngayGiaoDich: {
            type: String,
            required: true,
        },

        //account No
        soTaiKhoan: {
            type: String,
            required: true,
        },

        //credit Amount
        soTienGhi: {
            type: Date,
            required: true,
        },

        //currency
        tienTe: {
            type: Number,
            required: true,
        },

        //description
        moTa: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const NganHangModel = mongoose.model('nganhang', NganHangSchema);
export default NganHangModel;
