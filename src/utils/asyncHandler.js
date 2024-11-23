/**
 * Wraps an async function to catch errors and pass them to the next middleware.
 * @param {Function} fn - The asynchronous route handler function to wrap.
 * @returns {Function} - A new function that handles errors from the async function.
 */

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise
        .resolve(fn(req, res, next))
        .catch((err) => next(err));
    };
}