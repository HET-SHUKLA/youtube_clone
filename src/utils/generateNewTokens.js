import { User } from "../models/user.model.js";
import { createError } from "./apiError.js";
import { asyncHandler } from "./asyncHandler.js";

export const generateAccessAndRefreshToken = async (user) => {
    const access = await user.generateAccessToken();
    const refresh = await user.generateRefreshToken();

    return {access, refresh};
}

export const refreshTokenHandler = asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies;

    if(!refreshToken){
        throw createError(401, 'Unauthorized');
    }

    const decode = jwt.verify(refreshToken, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decode._id).select('-password -watchHistory');

    const {access, refresh} = generateAccessAndRefreshToken(user);

    //Saving refresh token into DB
    user.refreshToken = refresh;
    user.save({validateBeforeSave: false});

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    }
    
    res
    .cookie('accessToken', access, {...cookieOptions, maxAge: 86400000})
    .cookie('refreshToken', refresh, {...cookieOptions, maxAge: 604800000});
});