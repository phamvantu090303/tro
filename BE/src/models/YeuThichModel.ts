/** @format */

import mongoose, { Schema } from 'mongoose';

const YeuThichSchema = new Schema(
    {
        id_phong: {
            type:String, // Giả sử id_phong là tham chiếu đến một tài liệu khác
            ref: 'Phong', // Tên model được tham chiếu (nếu có)
            required: true, // Sửa require -> required
        },

        id_user: {
            type: String,
            ref: 'User', // Tên model được tham chiếu (nếu có)
            required: true,
        },

        hinh_anh: {
            type: String,
            required: false, // Đổi require -> required
        },

        gia_thue: {
            type: Number, // Sửa thành Number để đại diện giá thuê
            required: true,
        },

        mo_ta: {
            type: String,
            required: false,
            maxlength: 1000, // Giới hạn tối đa 1000 ký tự
        },

        trang_thai: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const yeuthichModel = mongoose.model('Yeu_thichs', YeuThichSchema);
export default yeuthichModel;
