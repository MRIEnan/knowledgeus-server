import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/users';
const usersRouter = express.Router();

usersRouter.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);

usersRouter.post(
  '/my-profile',
  auth(ENUM_USER_ROLE.GENERAL),
  UserController.myProfile,
);

export const UserRoutes = usersRouter;
