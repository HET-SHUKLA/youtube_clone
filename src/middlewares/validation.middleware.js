import { createError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Validate input by passing schema from Validators
 * @param {Object} schema - Validation schema
 * @returns 
 */

export const validateInput = (schema) => {
    return asyncHandler ((req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            console.log(error);
            throw createError(400, error.details[0].message);
        }
        next();
    });
};
  