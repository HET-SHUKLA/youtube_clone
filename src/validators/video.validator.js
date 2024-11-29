import Joi from 'joi';

export const videoUploadValidationSchema = Joi.object({
    title: Joi.string().max(50).required(),
    description: Joi.string().max(2000).required(),
    isPrivate: Joi.boolean()
});

export const videoPrivateValidationSchema = Joi.object({
    videoId: Joi.string().required(),
    isPrivate: Joi.boolean().required()
});