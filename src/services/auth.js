import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const registerUser = async (payload) => {
  // Хешування паролів за допомогою бібліотеки bcrypt
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // Валідацію унікальності. Перевірка, чи існує користувач з таким email
  const userEmail = await UsersCollection.findOne({
    email: payload.email,
  });

  if (userEmail) {
    throw createHttpError(409, 'Email in use');
  }

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};
