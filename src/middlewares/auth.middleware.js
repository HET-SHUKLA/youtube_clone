import jwt from "jsonwebtoken";
import { createError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_SECRET } from "../utils/config.js";

export const authUser = asyncHandler(async (req, res, next) => {
    const {accessToken, refreshToken} = req.cookies;
    
    if(!accessToken && !refreshToken){
        throw createError(401, 'Unauthorized');
    }

    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    console.log(decode);
    next();
});