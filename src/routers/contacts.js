import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// Отримання колекції всіх контактів
router.get('/contacts', ctrlWrapper(getContactsController));

// Отримання контакта за його id
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

// Додавання контакта
router.post('/contacts', ctrlWrapper(createContactController));

// Часткове оновлення контакту за його id
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

// Видалення контакта за його id
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
