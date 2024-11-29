import { User } from '../models/user.model.js';
import { createError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { uploadFile } from '../utils/cloudinary.js';
import { REFRESH_TOKEN_SECRET } from '../utils/config.js';
import { generateAccessAndRefreshToken } from '../utils/generateNewTokens.js';
import jwt from 'jsonwebtoken';


const handleRegisterUser = asyncHandler (async (req, res) => {
    let {username, email, fullName, password} = req.body;

    username = (username.trim()).toLowerCase();
    email = (email.trim()).toLowerCase();
    fullName = fullName.toLowerCase();

    //Find if user exists
    const isExists = await User.findOne(
        {
            $or: [{username}, {email}]
        }
    );

    if(isExists){
        throw createError(401, 'Username or email is already exists');
    }

    //validate avatar and coverImage
    const { avatar, coverImage } = req.files;
    
    let avatarResult, coverResult;

    if(avatar){
        avatarResult = await uploadFile(avatar[0].path);
    }

    if(coverImage){
        coverResult = await uploadFile(coverImage[0].path);
    }
    
    //Save User
    const user = await User.create({
        username, 
        email,
        fullName,
        password,
        avatar: avatarResult.url || '',
        coverImage: coverResult.url || ''
    });

    if(!user){
        throw createError(500, 'Something went wrong, User is unable to create');
    }

    return res.status(201).json(apiResponse(user));
});

const handleUserLogin = asyncHandler (async (req, res) => {
    //user can be username or user email
    const {user, password} = req.body;

    //check if its an email
    const isEmail = user.includes('@') ? true : false;
    
    let query;

    if(isEmail){
        query = {
            email : user
        }
    } else {
        query = {
            username : user
        }
    }

    //Finding user
    const foundUser = await User.findOne(query).select('-watchHistory');
    
    if(!foundUser){
        throw createError(404, 'User does not exist');
    }

    const isPasswordCorrect = await foundUser.isPasswordMatch(password);

    if(!isPasswordCorrect){
        throw createError(404, 'Password is incorrect');
    }

    const {access, refresh} = await generateAccessAndRefreshToken(foundUser);

    //Saving refresh token into DB
    foundUser.refreshToken = refresh;
    foundUser.save({validateBeforeSave: false});

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie('accessToken', access, {...cookieOptions, maxAge: 86400000})
    .cookie('refreshToken', refresh, {...cookieOptions, maxAge: 604800000})
    .json(apiResponse({'accessToken':access, 'refreshToken': refresh}));
});

const handleUserLogout = asyncHandler(async (req, res) => {
    //Removing refreshToken from DB
    await User.findByIdAndUpdate(
        {
            _id: req.user
        },
        {
            $unset: {refreshToken: ''}
        }
    );

    //Clearing cookie
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(200).json(apiResponse('Logged out succesfully'));
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies;

    if(!refreshToken){
        throw createError(401, 'Unauthorized');
    }

    const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findById(decode._id).select('-password -watchHistory');

    const {access, refresh} = await generateAccessAndRefreshToken(user);

    //Saving refresh token into DB
    user.refreshToken = refresh;
    user.save({validateBeforeSave: false});

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    }
    
    res.status(200)
    .cookie('accessToken', access, {...cookieOptions, maxAge: 86400000})
    .cookie('refreshToken', refresh, {...cookieOptions, maxAge: 604800000})
    .json(apiResponse({'access': access, 'refresh': refresh}));
});

const handleChangePassword = asyncHandler(async (req, res) => {
    const {currentPassword, newPassword} = req.body;

    if(!req.user){
        throw createError(401, 'Unauthorized');
    }

    const user = await User.findById(
        {
            _id: req.user
        }
    );

    const isPassSame = await user.isPasswordMatch(currentPassword);

    if(!isPassSame){
        throw createError(404, 'Current Password does not match');
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res.status(200).json(apiResponse(user));
});

const handleGetCurrentUser = asyncHandler(async (req, res) => {
    if(!req.user){
        throw createError(401, 'No user exists');
    }

    return res.status(200).json(apiResponse(req.user));
});

export {
    handleRegisterUser,
    handleUserLogin,
    handleUserLogout,
    handleRefreshToken,
    handleGetCurrentUser,
    handleChangePassword
}