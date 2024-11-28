import { createError } from "./apiError.js";

export const generateAccessAndRefreshToken = async (user) => {
    try {
        const access = await user.generateAccessToken();
        const refresh = await user.generateRefreshToken();
    
        return {access, refresh};
    } catch (error) {
        throw createError(500, error);
    }
}

