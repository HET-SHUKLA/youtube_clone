/**
 * @typedef {Object} SUCCESS_RESPONSE
 * @property {boolean} success - Indicates operation success (Always 'true').
 * @property {Object} data - Payload of the response (customizable).
 * @property {string} timestamp - Timestamp of an API response.
 */


/**
 * @typedef {Object} ERROR_RESPONSE
 * @property {boolean} success - Indicates operation success (Always 'false').
 * @property {Object} error - Error detail.
 * @property {string} error.message - Error message.
 * @property {number} error.code - Error code (default 500).
 * @property {string} timestamp - Timestamp of an API response.
 */