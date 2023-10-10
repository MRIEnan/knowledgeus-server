import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthService.loginUser(loginData);

  const { refreshToken, ...others } = result;

  //   set refresh token into cookie

  const cookieOptionsOne = {
    secure: config.env === 'production',
    httpOnly: true,
    path: '/',
  };
  const cookieOptionsTwo = {
    secure: config.env === 'production',
    httpOnly: false,
    path: '/',
  };
  res.cookie('refreshToken', refreshToken, cookieOptionsOne);

  res.cookie('accessToken', others.accessToken, cookieOptionsTwo);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  //   set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  //   delete result.refreshToken;
  // if('refreshToken' in result){
  //     delete result.refreshToken;
  // }

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'refreshed successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  const result = await AuthService.changePassword(user, passwordData);

  sendResponse<void>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password changed successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
