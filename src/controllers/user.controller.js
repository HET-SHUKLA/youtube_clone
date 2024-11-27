import { User } from '../models/user.model.js';
import { createError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { uploadFile } from '../utils/cloudinary.js';

const handleRegisterUser = asyncHandler (async (req, res) => {
    let {username, email, fullName, password} = req.body;

    if (!username, !email, !fullName, !password){
        throw createError(400, 'Fields can not be empty');
    }

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
        avatar: avatarResult || '',
        coverImage: coverResult || ''
    });

    if(!user){
        throw createError(500, 'Something went wrong, User is unable to create');
    }

    return res.status(201).json(apiResponse(user));
});

export {
    handleRegisterUser
}