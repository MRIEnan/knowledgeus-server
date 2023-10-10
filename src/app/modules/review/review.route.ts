import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/users';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validaton';
import { ReviewController } from './review.controller';

const router = express.Router();

router.get('/:id', ReviewController.getAllReview);

router.post(
  '/:id',
  auth(ENUM_USER_ROLE.GENERAL),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview,
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.GENERAL),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateReview,
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.GENERAL),
  ReviewController.deleteReview,
);

export const ReviewRouter = router;
