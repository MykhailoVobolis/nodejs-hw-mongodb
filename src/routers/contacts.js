import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middleware/validateBody.js';
import { isValidId } from '../middleware/isValidId.js';
import { authenticate } from '../middleware/authenticate.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.use(authenticate);

// Отримання колекції всіх контактів
router.get('/', ctrlWrapper(getContactsController));

// Отримання контакта за його id
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// Додавання контакта
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// Часткове оновлення контакту за його id
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// Видалення контакта за його id
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
