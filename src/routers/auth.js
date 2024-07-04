import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
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

export default router;
