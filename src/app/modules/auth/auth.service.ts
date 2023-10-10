import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import hashPassword from '../../../helpers/hashPassword';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);
  // check user exist
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists');
  }

  // match password

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  const { _id, id: userId, role, needsPasswordChange } = isUserExist;

  // create access token
  const accessToken = jwtHelpers.createToken(
    {
      oId: _id,
      userId: userId,
      role: role,
    },
    config.jwt.secret as Secret,
    config.jwt.jwt_expires_in as string,
  );

  // create  refresh token
  const refreshToken = jwtHelpers.createToken(
    {
      oId: _id,
      userId: userId,
      role: role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // verily token
  const verifiedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_secret as string,
  );

  const { userId } = verifiedToken;

  //   checking deleted user's refresh token
  const isUserExist = await User.isUserExist(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  //   generate new token
  const newAccessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.jwt_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.isUserExist(user.userId);
  // check user exist
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists');
  }

  // match password

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //   hash password before saving

  const newHashedPassword = await hashPassword(newPassword);

  const query = { id: user.userId };
  const updatedData = {
    password: newHashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  };
  // update password
  await User.findOneAndUpdate(query, updatedData);
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
