/** @format */

import mongoose, { Schema } from 'mongoose';

const HinhAnhPhongScheme = new Schema(
	{
		id_phong_tro : {
			type : String,
			require: true
		},

		image_url: {
			type: String,
			require: false
		},
		
	},
	{ timestamps: true }
);

const HinhAnhPhongModel = mongoose.model('hinh_anh_phongs', HinhAnhPhongScheme);
export default HinhAnhPhongModel;
