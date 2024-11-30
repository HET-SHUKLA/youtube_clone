import jwt from "jsonwebtoken";
import { createError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_SECRET } from "../utils/config.js";

export const authUser = asyncHandler(async (req, res, next) => {
    if(req.user){
        return next();
    }

    const {accessToken} = req.cookies;

    if(!accessToken){
        throw createError(401, 'Unauthorized');
    }

    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    req.user = decode._id;
    req.username = decode.username;
    next();
});