import { Joi } from 'celebrate';

// eslint-disable-next-line import/prefer-default-export
export const objectIdValidation = Joi.string().hex().length(24).required();
