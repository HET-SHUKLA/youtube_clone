import jwt from "jsonwebtoken";
import { createError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_SECRET } from "../utils/config.js";

export const authUser = asyncHandler(async (req, res, next) => {
    const {accessToken, refreshToken} = req.cookies;

    if(!accessToken && !refreshToken){
        throw createError(401, 'Unauthorized');
    }

    if(!accessToken && refreshToken){
        await refreshTokenHandler(req, res);
    }

    //req.cookies.accessToken because if new access token generated from refreshTokenHandler then can be accessed from cookie
    const decode = jwt.verify(req.cookies.accessToken, ACCESS_TOKEN_SECRET);

    req.user = decode._id;
    next();
});