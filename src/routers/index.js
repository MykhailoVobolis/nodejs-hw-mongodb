import { Router } from 'express';

// Підключення 2х окремих роутів, для взаємодії з колекцією контактів і колекцією користувачів
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
