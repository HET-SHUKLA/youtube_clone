/**
 * Format a Error response
 * @param {number} code - HTTP status code, default 500.
 * @param {string} message - Error message.
 * @returns {ERROR_RESPONSE} - Formatted Error response.
 */

export const apiError = (code = 500, message) => {
    return {
        success: false,
        error: {
            message,
            code
        },
        timestamp: new Date().toISOString(),
    };
}

/**
 * 
 * @param {number} status - HTTP status code for the error (Default 500)
 * @param {string} message - Error message
 * @returns {Object} - Returning an Error Object with status code
 */

export const createError = (status = 500, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
}