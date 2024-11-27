import { apiError } from "../utils/apiError.js";

export const errorHandling = (err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json(apiError(statusCode, err.message));
}