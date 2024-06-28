import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  const { status = 500, message = 'Something went wrong' } = err;
  res.status(500).json({
    status,
    message,
    data: err.message,
  });
};
