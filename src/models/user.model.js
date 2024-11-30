import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { SALT_ROUND } from "../constants.js";
import jwt from 'jsonwebtoken';
import {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY
} from '../utils/config.js';

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

        fullName: {
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

        subscribers: {
            type: Number,
            default: 0
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

//method to generate access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    );
}

//method to generate refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    );
}

export const User = mongoose.model('User', userSchema);