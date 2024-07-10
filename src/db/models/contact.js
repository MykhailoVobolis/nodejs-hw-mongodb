import { model, Schema } from 'mongoose';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

import {
  typeList,
  emailRegexp,
  phoneNumberRegexp,
} from '../../constants/contacts-constants.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
    },
    phoneNumber: {
      type: String,
      minLength: 3,
      maxLength: 20,
      match: phoneNumberRegexp,
      required: true,
    },
    email: {
      type: String,
      minLength: 3,
      maxLength: 20,
      match: emailRegexp,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
      enum: typeList,
      default: 'personal',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    photo: { type: String, required: false },
  },
  {
    versionKey: false, // Виключення додавання версії оновлення об'єкту
    timestamps: true, // Вказування дати додавання та дати оновлення об'єкту
  },
);

// Використання Mongoose хук mongooseSaveError при додаванні("save") об'єкта що не відповідає схемі валідації
contactsSchema.post('save', mongooseSaveError);

// Використання Mongoose хук setUpdateSettings перед ("pre") оновленням об'екта
contactsSchema.pre('findOneAndUpdate', setUpdateSettings);

// Використання Mongoose хук mongooseSaveError при оновленні "findOneAndUpdate" об'єкта що не відповідає схемі валідації
contactsSchema.post('findOneAndUpdate', mongooseSaveError);

// Створення та експорт моделі
export const ContactsCollection = model('contacts', contactsSchema);
