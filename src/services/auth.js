import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

export const registerUser = async (payload) => {
  // Перевірка що користувач із такою поштою ще не існує в системі
  const userEmail = await UsersCollection.findOne({
    email: payload.email,
  });

  if (userEmail) {
    throw createHttpError(409, 'Email in use');
  }

  return await UsersCollection.create(payload);
};
