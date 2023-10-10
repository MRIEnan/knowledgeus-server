import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import { IWishlist } from './wishlist.interface';
import { JwtPayload } from 'jsonwebtoken';
import { Book } from '../book/book.model';
import { Wishlist } from './wishlist.model';
import { EWishlist } from './wishlist.constant';
import { IPaginationOption } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';

const createWish = async (
  userInfo: JwtPayload,
  wishData: Pick<IWishlist, 'bookId'>,
): Promise<IWishlist | null> => {
  const isUserExist = await User.isUserExistByIdInBool(userInfo.oId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const isBookExists = await Book.isBookExistsWithIdInBool(
    String(wishData.bookId),
  );
  if (!isBookExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book not found');
  }

  const isAlreadyWished = await Wishlist.findOne({
    userId: userInfo.oId,
    bookId: wishData.bookId,
  });

  if (isAlreadyWished) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book already in wishlist');
  }

  const wishlistData: IWishlist = {
    userId: userInfo.oId,
    bookId: wishData.bookId,
    status: EWishlist.GoingToRead,
  };

  const result = await Wishlist.create(wishlistData);

  return result;
};

const updateWish = async (
  userInfo: JwtPayload,
  wishData: Pick<IWishlist, '_id' | 'status'>,
): Promise<IWishlist | null> => {
  const isUserExist = await User.isUserExistByIdInBool(userInfo.oId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const isWishExists = await Wishlist.findOne({
    _id: String(wishData._id),
  });

  if (!isWishExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wish not found');
  }

  const wishlistData = {
    status: wishData.status,
  };

  const result = await Wishlist.findOneAndUpdate(
    { _id: wishData._id },
    wishlistData,
    { new: true },
  );

  return result;
};
const deleteWish = async (
  userInfo: JwtPayload,
  wishData: Pick<IWishlist, '_id'>,
): Promise<IWishlist | null> => {
  const { _id: wId } = wishData;
  const isUserExist = await User.isUserExistByIdInBool(userInfo.oId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const isWishExists = await Wishlist.findOne({
    _id: String(wId),
  });

  if (!isWishExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wish not found');
  }

  const result = await Wishlist.findOneAndDelete({ _id: wId });

  return result;
};

const getAllWish = async (
  userInfo: JwtPayload,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IWishlist[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const query = { userId: userInfo.oId };
  const result = await Wishlist.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate([{ path: 'userId' }, { path: 'bookId' }]);

  const total = await Wishlist.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const WishlistService = {
  updateWish,
  createWish,
  getAllWish,
  deleteWish,
};
