import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  loginWithGoogleOAuthSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  getGoogleOAuthUrlController,
  loginUserController,
  loginWithGoogleController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middleware/validateBody.js';

const router = Router();

// Роутер для регістрації користувача
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

// Роутер для login користувача
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// Роутер для logout користувача
router.post('/logout', ctrlWrapper(logoutUserController));

// Роутер для refresh користувача
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

// Роут для звпиту скидання паролю через емейл
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

// Роут для скидання/зміну паролю
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

// Роут створення посилання за яким буде відбуватися Google аутентифікація
router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

// Роут Google аутентифікації
router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;
