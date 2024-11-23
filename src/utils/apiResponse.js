import {SUCCESS_RESPONSE} from './types.js';

/**
 * Format a success response
 * @param {Object} data - Response payload (can contain message, result etc).
 * @returns {SUCCESS_RESPONSE} - Formatted success response.
 */

export const apiResponse = (data=[]) => {
    return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
    };
}