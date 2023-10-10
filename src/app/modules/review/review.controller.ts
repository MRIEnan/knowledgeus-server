import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IReview } from './review.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ReviewService } from './review.service';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/paginationFields';

const getAllReview = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const bookId = req.params.id;
    const paginationOptions = pick(req.query, paginationFields);

    const result = await ReviewService.getAllReview(bookId, paginationOptions);

    sendResponse<IReview[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'review retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const createReview = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const bookId = req.params.id;
    const { ...reviewData } = req.body;
    const userInfo = req.user;

    if (!userInfo || !bookId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
    }

    const result = await ReviewService.createReview(
      userInfo,
      bookId,
      reviewData,
    );

    sendResponse<IReview | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  },
);

const updateReview = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const revId = req.params.id;
    const { ...reviewData } = req.body;
    const userInfo = req.user;

    if (!userInfo || !revId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
    }
    const result = await ReviewService.updateReview(
      userInfo,
      revId,
      reviewData,
    );

    sendResponse<IReview | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review updated successfully',
      data: result,
    });
  },
);

const deleteReview = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const revId = req.params.id;
    const userInfo = req.user;
    if (!userInfo || !revId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
    }

    const result = await ReviewService.deleteReview(userInfo, revId);

    sendResponse<IReview | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review deleted successfully',
      data: result,
    });
  },
);

export const ReviewController = {
  getAllReview,
  createReview,
  updateReview,
  deleteReview,
};
