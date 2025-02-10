/** @format */

import mongoose, { Schema } from 'mongoose';

const HoaDonScheme = new Schema(
    {
        id_phong: {
            type: String,
            required: false,
        },
        id_users: {
            type: String,
            required: true,
        },
        id_dichvu: {
            type: String,
            required: true,
        },
        trang_thai: {
            type: Number,
            required: true,
        },
        tien_phong: {
            type: Number,
            required: true,
        },
        tong_tien: {
            type: Number,
            required: true,
        },
        ngay_thu: {
            type: Date,
            required: true,
        },
        ngay_nop: {
            type: Date,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

const HoaDonModel = mongoose.model('hoadon', HoaDonScheme);
export default HoaDonModel;
