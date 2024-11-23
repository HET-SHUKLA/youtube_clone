import {ERROR_RESPONSE} from './types.js';

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