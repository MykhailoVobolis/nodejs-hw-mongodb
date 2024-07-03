import Joi from 'joi';
import { emailRegexp } from '../constants/contacts-constants.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});
