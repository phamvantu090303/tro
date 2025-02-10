/** @format */

import mongoose, { Schema } from 'mongoose';

const DichVuScheme = new Schema(
    {
        tien_dien : {
            type : Number,
            require: true
        },

        tien_nuoc: {
            type: Number,
            require: true
        },
        tien_wifi: {
            type: Number,
            require: true
        },
        
    },
    { timestamps: true }
);

const DichVuModel = mongoose.model('Dich_vu', DichVuScheme);
export default DichVuModel;
