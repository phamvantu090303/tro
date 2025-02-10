/** @format */

import mongoose, { Schema } from 'mongoose';

const MapScheme = new Schema(
	{
		address : {
			type : String,
			require: true
		},

		district: {
			type: String,
			require: true
		},

		latitude: {
			type: Number,
			require: true
		},

		longitude: {
			type: Number,
			require: true
		},
		province: {
			type: String,
			require: true
		},

		ward: {
			type: String,
			require: true
		}
	},
	{ timestamps: true }
);

const MapModel = mongoose.model('maps', MapScheme);
export default MapModel;
