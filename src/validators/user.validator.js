import Joi from 'joi';

export const registerValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).max(50).required(),
    fullName: Joi.string().max(50).required()
});

export const loginValidationSchema = Joi.object({
    user: Joi.required(),
    password: Joi.required()
});

export const changePasswordValidationSchema = Joi.object({
    currentPassword: Joi.required(),
    newPassword: Joi.string().min(8).max(50).required(),
    confirmPassword: Joi.ref('newPassword')
});
