import Joi from 'joi';
import { emailRegexp } from '../constants/contacts-constants.js';

// Joi валідація при реестрації користувача
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});

// Joi валідація при login користувача
export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});

// Joi валідація об’єкта юзера при запиті на скидання пароля
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
