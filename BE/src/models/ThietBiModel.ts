/** @format */

import mongoose, { Schema } from 'mongoose';

const ThietBiScheme = new Schema(
	{
		id_phong_tro : {
			type : String,
			require: false
		},

		ten_thiet_bi: {
			type: String,
			require: true
		},

		so_luong_thiet_bi: {
			type: Number,
			require: false
		},

		trang_thai: {
			type: Number,
			require: true
		}
	},
	{ timestamps: true }
);

const ThietBiModel = mongoose.model('thiet_bis', ThietBiScheme);
export default ThietBiModel;
