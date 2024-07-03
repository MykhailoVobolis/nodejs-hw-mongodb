import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import router from './routers/index.js';

import { env } from './utils/env.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

// Читаємо змінну оточення PORT
const PORT = Number(env('PORT', '3000'));

// Функція створення сервера
export const setupServer = () => {
  const app = express();

  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  // наприклад, у запитах POST або PATCH
  app.use(express.json());

  // Middleware CORS що дозволяє робити кросбраузерні запити
  app.use(cors());

  // Middleware для логування, такий як pino-http, слід розташовувати якомога раніше у ланцюгу middleware
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  // Middleware для обробки випадку, коли клієнт звертається до неіснуючого маршруту
  // додається завжди в кінці, після всіх інших middleware та маршрутів
  app.use('*', notFoundHandler);

  // Middleware для обробких помилок (приймає 4 аргументи)
  // додається завжди самим останнім, після всіх інших middleware та маршрутів
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
