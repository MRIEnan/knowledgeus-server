import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { BookValidation } from './book.validation';
import { BookController } from './book.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-book',
  auth(ENUM_USER_ROLE.GENERAL),
  validateRequest(BookValidation.createBookZodSchema),
  BookController.createBook,
);

router.get('/:id', BookController.getSingleBook);
router.get('/', BookController.getAllBook);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.GENERAL),
  validateRequest(BookValidation.updateBookZodSchema),
  BookController.updateBook,
);

router.delete('/:id', auth(ENUM_USER_ROLE.GENERAL), BookController.deleteBook);

export const BookRouter = router;
