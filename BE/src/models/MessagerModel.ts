/** @format */

import mongoose, { Schema } from 'mongoose';

const MessagersScheme = new Schema(
    {
        nguoi_gui: {
            type: String,
            required: true,
        },
        nguoi_nhan: {
            type: String,
            required: true,
        },
        noi_dung: {
            type: String,
            required: true,
        },
        is_read: {
            type: Boolean,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

const MessagersModel = mongoose.model('messagers', MessagersScheme);
export default MessagersModel;
