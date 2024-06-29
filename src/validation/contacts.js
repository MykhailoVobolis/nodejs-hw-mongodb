import Joi from 'joi';

import {
  emailRegexp,
  phoneNumberRegexp,
  typeList,
} from '../constants/contacts-constants.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(phoneNumberRegexp)
    .required(),
  email: Joi.string().min(3).max(20).pattern(emailRegexp),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20).pattern(phoneNumberRegexp),
  email: Joi.string().min(3).max(20).pattern(emailRegexp),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList),
});
