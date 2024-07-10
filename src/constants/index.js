import path from 'node:path';

export const sortOrderList = ['asc', 'desc']; // Сортування за зростанням / за спаданням

export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // Терміну життя access токену - 15 хв.
export const REFRESH_TOKEN_LIFETIME = 30 * 24 * 3600 * 1000; // Терміну життя refresh токену - 30 днів

// Константи для надсилання email при скиданні паролю
export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

// Абсолютний шлях до папки templates
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};
