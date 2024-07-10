import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { trace } from 'node:console';

// Сервіс-функція реестрації користувача
export const registerUser = async (payload) => {
  // Хешування паролів за допомогою бібліотеки bcrypt
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // Валідацію унікальності. Перевірка, чи існує користувач з таким email
  const user = await UsersCollection.findOne({
    email: payload.email,
  });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// Сервіс-функція login користувача
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Порівнюємо хеші паролів, того що записан в базі даних та того з яким логіниться користувач
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // Видалення попередньої сесії користувача, якщо така існує, з колекції сесій.
  await SessionsCollection.deleteOne({ userId: user._id });

  // Генерація нових токенів доступу та оновлення.
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  // Створення нової сесії в базі даних
  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};

// Сервіс-функція logout користувача
export const logoutUser = async (sessionId) => {
  // Видалення поточної сессії користувача
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// Сервіс-функція refresh користувача
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

// Сервіс-функція для створення запиту на скидання паролю
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Створення токена скидання пароля
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  // Використання шаблонізатора handlebars в процес створення html листа
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
      err,
    );
  }
};

// Сервіс-функція для зміни паролю
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // Оновлення паролю користувача
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  // Видалення поточної сесії користувача при зміні паролю
  await SessionsCollection.deleteOne({ userId: user._id });
};
