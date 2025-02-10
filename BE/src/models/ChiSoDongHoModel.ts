/** @format */

import mongoose, { Schema } from 'mongoose';

const ChiSoDongHoScheme = new Schema(
    {
        id_phong: {
            type: String,
            required: true,
        },
        id_users: {
            type: String,
            required: true,
        },
        ngay_thang_nam: {
            type: Date,
            required: true,
        },
        chi_so_dien: {
            type: Number,
            required: true,
        },
        image_dong_ho_dien: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

const ChiSoDongHoModel = mongoose.model('chisodongho', ChiSoDongHoScheme);
export default ChiSoDongHoModel;
