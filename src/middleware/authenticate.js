import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  // Перевірка заголовка авторизації:
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  // Перевірка типу заголовка та наявності токена доступу
  // Функція розділяє заголовок авторизації на дві частини: тип (повинен бути "Bearer") і сам токен
  const [bearer, token] = authHeader.split(' ');

  // Перевірка типу заголовку
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  // Перевірка наявності токену доступу
  if (!token) {
    return next(createHttpError(401, 'Token missing'));
  }

  // Перевірка наявності сесії
  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  // Перевірка терміну дії токена доступу
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // Пошук користувача
  // Функція шукає користувача в колекції UsersCollection за ідентифікатором користувача, який зберігається в сесії
  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  // Якщо всі перевірки успішні, функція додає до req.user об'єкт користувача який робить запит.
  //  Інформацію про користувача потім доступна в контролерах і мідлварах. Наприклад userId
  req.user = user;

  next();
};
