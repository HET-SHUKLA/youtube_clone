import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },

        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        },
    },
    {
        timestamps: true
    }
);

export const Like = mongoose.model('Like', likeSchema);