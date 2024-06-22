import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
  },
  {
    versionKey: false, // Виключення додавання версії оновлення об'єкту
    timestamps: true, // Вказування дати додавання та дати оновлення об'єкту
  },
);

export const ContactsCollection = model('contacts', contactsSchema);
