import { JwtPayload } from 'jsonwebtoken';
import { IReview } from './review.interface';
import { User } from '../users/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Book } from '../book/book.model';
import { SortOrder, Types } from 'mongoose';
import { Review } from './review.model';
import { IPaginationOption } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';

const getAllReview = async (
  bookId: string,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IReview[] | null>> => {
  const isBookExists = await Book.isBookExistsWithIdInBool(bookId);

  if (!isBookExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  const { page, limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Review.find({ bookId: bookId })
    .sort(sortConditions)
    .limit(limit)
    .skip(skip)
    .populate([{ path: 'bookId' }, { path: 'userId' }]);

  const total = await Review.countDocuments({ bookId: bookId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createReview = async (
  userInfo: JwtPayload,
  bookId: string,
  payload: Pick<IReview, 'review' | 'rating'>,
): Promise<IReview | null> => {
  const isUserExists = await User.isUserExistByIdInBool(userInfo.oId);
  if (!isUserExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user ');
  }

  const isBookExists = await Book.isBookExistsWithIdInBool(String(bookId));
  if (!isBookExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid book');
  }

  const newData: IReview = {
    ...payload,
    userId: userInfo.oId,
    bookId: new Types.ObjectId(bookId),
  };

  const result = (
    await (await Review.create(newData)).populate({ path: 'userId' })
  ).populate({ path: 'bookId' });
  return result;
};

const updateReview = async (
  userInfo: JwtPayload,
  revId: string,
  payload: Partial<IReview>,
): Promise<IReview | null> => {
  const isUserExists = await User.isUserExistByIdInBool(userInfo.oId);
  if (!isUserExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user ');
  }

  const hasEditAccess = await Review.isThisReviewer(revId, userInfo.oId);

  if (!hasEditAccess) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  const result = await Review.findOneAndUpdate({ _id: revId }, payload, {
    new: true,
  })
    .populate({ path: 'userId' })
    .populate('bookId');

  return result;
};

const deleteReview = async (
  userInfo: JwtPayload,
  revId: string,
): Promise<IReview | null> => {
  const isUserExists = await User.isUserExistByIdInBool(userInfo.oId);
  if (!isUserExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user ');
  }
  const isReviewExists = await Review.isReviewExists(revId);
  if (!isReviewExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }

  const hasEditAccess = await Review.isThisReviewer(revId, userInfo.oId);
  if (!hasEditAccess) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  const result = await Review.findOneAndDelete({ _id: revId });
  return result;
};

export const ReviewService = {
  getAllReview,
  createReview,
  updateReview,
  deleteReview,
};
