import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/paginationFields';
import { WishlistService } from './wishlist.service';
import { IWishlist } from './wishlist.interface';
import { Wishlist } from './wishlist.model';

const createWish = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { ...wishData } = req.body;
    const userInfo = req.user;

    if (!userInfo || !wishData) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
    }

    const result = await WishlistService.createWish(userInfo, wishData);

    sendResponse<IWishlist | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wish added successfully',
      data: result,
    });
  },
);

const deleteWish = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const wishData: Pick<IWishlist, '_id'> = new Wishlist({ _id: id });
    const userInfo = req.user;

    if (!userInfo || !wishData) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
    }

    const result = await WishlistService.deleteWish(userInfo, wishData);

    sendResponse<IWishlist | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wish deleted successfully',
      data: result,
    });
  },
);
const updateWish = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { ...wishData } = req.body;
    const userInfo = req.user;

    if (!userInfo || !wishData) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
    }

    const result = await WishlistService.updateWish(userInfo, wishData);

    sendResponse<IWishlist | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wish updated successfully',
      data: result,
    });
  },
);

const getAllWish = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const userInfo = req.user;

  if (!userInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
  }

  const result = await WishlistService.getAllWish(userInfo, paginationOptions);

  sendResponse<IWishlist[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Wish retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const WishlistController = {
  createWish,
  deleteWish,
  updateWish,
  getAllWish,
};
