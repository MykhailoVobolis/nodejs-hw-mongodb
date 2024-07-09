import {
  logoutUser,
  loginUser,
  registerUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/index.js';

// Контролер реєстрації користувача
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  const data = {
    name: user.name,
    email: user.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

// Контроллер login користувача
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  // Встановлюємо два куки: refreshToken і sessionId, використовуючи метод res.cookie.
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// Контроллер logout користувача
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  // Очищення куків sessionId і refreshToken, використовуючи метод res.clearCookie.
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// Контроллер refresh користувача
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// Контролер відправки листа-запита на зміну пароля користувача
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

// Контролер зміни пароля користувача
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
