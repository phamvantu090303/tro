/** @format */

import mongoose, { Schema } from 'mongoose';

const PhongTroScheme = new Schema(
    {
        ma_phong: {  //trường này đại diện cho id của phòng 
            type: String,
            required: true,
        },
        id_map: {
            type: String,
            required: false,
        },
        ma_danh_muc: {
            type: String,
            required: true,
        },
        id_users: {
            type: String,
            required: false,
        },
        ten_phong_tro: {
            type: String,
            required: true,
        },
        mo_ta: {
            type: String,
            required: false,
        },
        dien_tich: {
            type: String,
            required: false,
        },
        gia_tien: {
            type: Number,
            default: 1,
        },
        trang_thai: {
            type: Number,
            required: true,
        },
        so_luong_nguoi: {
            type: Number,
            default: 1,
        },

        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

const PhongTroModel = mongoose.model('phongtro', PhongTroScheme);
export default PhongTroModel;
