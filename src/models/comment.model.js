import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        comment: {
            type: String,
            required: true
        },

        likes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);