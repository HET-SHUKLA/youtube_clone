import Joi from 'joi';

export const subscriptionValidationSchema = Joi.object({
    channelId: Joi.required(),
});