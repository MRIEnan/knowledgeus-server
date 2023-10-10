import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { WishlistValidation } from './wishList.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { WishlistController } from './wishlist.controller';

const router = express.Router();
// todo: get wish of any user [get]
router.get('/', auth(ENUM_USER_ROLE.GENERAL), WishlistController.getAllWish);

// todo: add wish to the list [post]
router.post(
  '/add-wish',
  auth(ENUM_USER_ROLE.GENERAL),
  validateRequest(WishlistValidation.createWishlistZodSchema),
  WishlistController.createWish,
);

// todo: update wish to the list [patch]
router.patch(
  '/',
  auth(ENUM_USER_ROLE.GENERAL),
  validateRequest(WishlistValidation.updateWishlistZodSchema),
  WishlistController.updateWish,
);

//  todo: delete wish to the list [delete:/wishId]
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.GENERAL),
  WishlistController.deleteWish,
);

export const WishlistRouter = router;
