import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        content: {
            type: String,
            required: true,
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

const Post = mongoose.model('Post', postSchema);