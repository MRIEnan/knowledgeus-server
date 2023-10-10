import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import { IUser } from './user.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { generateUserId } from './user.utils';

const createUser = async (userInfo: IUser): Promise<IUser> => {
  //  check if the user email already exists
  const existsUser = await User.findOne({ email: userInfo.email });
  if (existsUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const myId = await generateUserId();
  userInfo.role = 'general';
  userInfo.id = myId;

  const newUser = new User(userInfo);

  const result = await newUser.save();

  return result;
};

const myProfile = async (userInfo: JwtPayload): Promise<IUser | null> => {
  const existsUser = await User.isUserExistByIdInBool(userInfo.oId);

  if (!existsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = User.findOne({ _id: userInfo.oId });
  return result;
};

export const UserService = {
  createUser,
  myProfile,
};
