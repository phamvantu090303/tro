/** @format */

import mongoose, { Schema } from 'mongoose';
import { UserVerifyStatus } from '../constants/enum';

const UserScheme = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		ho_va_ten: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		ngay_sinh: {
			type: Date,
			required: true,
		},
		id_quyen: {
			type: String,
			default: 'khachhang',
			required: false,
		},
		verify: {
			type: String, // Kiểu dữ liệu là String
			enum: Object.values(UserVerifyStatus), // Giới hạn giá trị thuộc enum UserVerifyStatus
			default: UserVerifyStatus.Unverified, // Giá trị mặc định là "Unverified"
			required: false,
		},
		que_quan: {
			type: String,
			default: 1,
		},
		so_dien_thoai: {
			type: Number,
			default: 1,
		},
		gioi_tinh: {
			type: String,
			default: 1,
		},
		cccd: {
			type: Number,
            require:true
		},
		
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{ timestamps: true }
);

const UserModel = mongoose.model('users', UserScheme);
export default UserModel;
