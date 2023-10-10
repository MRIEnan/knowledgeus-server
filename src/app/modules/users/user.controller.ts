import { Request, Response } from 'express';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

const createUser = catchAsync(
  async (req: Request, res: Response): Promise<IUser | void> => {
    const { ...userInfo } = req.body;
    const result = await UserService.createUser(userInfo);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully',
      data: result,
    });
  },
);

const myProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userInfo = req.user;
    if (!userInfo) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
    }
    const result = await UserService.myProfile(userInfo);
    sendResponse<IUser | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user retrieved successfully',
      data: result,
    });
  },
);
export const UserController = {
  createUser,
  myProfile,
};
