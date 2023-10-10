import { Model, Types } from 'mongoose';
import { IUser } from '../users/user.interface';
import { IBook } from '../book/book.interface';

export type IWishlist = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  bookId: Types.ObjectId | IBook;
  status: 'Reading' | 'Completed' | 'Going to Read';
  createdAt?: string;
  updatedAt?: string;
};

export type WishListModel = Model<IWishlist, Record<string, unknown>>;
