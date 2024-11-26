import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { SALT_ROUND } from "../constants";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            required: true,
            trim: true,
            unique: true,
            index: true
        },

        email: {
            type: String,
            lowercase: true,
            required: true,
            trim: true,
            unique: true,
        },

        fullname: {
            type: String,
            lowercase: true,
            required: true,
            index: true
        },

        avatar: {
            type: String //cloudinary URL
        },

        coverImage: {
            type: String //Cloudinary URL
        },

        password: {
            type: String,
            required: true
        },

        refreshToken: {
            type: String
        },

        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Video'
            }
        ]
    },
    {
        timestamps: true
    }
);

//pre-save middleware to encrypt password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, SALT_ROUND);
    next();
});

//method to compare password
userSchema.methods.isPasswordMatch = async function(pass){
    return await bcrypt.compare(pass, this.password);
}

export const User = mongoose.model('User', userSchema);