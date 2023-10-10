/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../users/user.interface';

export type IReview = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  bookId: Types.ObjectId | IBook;
  review: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewModel = {
  isThisReviewer(revId: string, userId: string): Promise<IReview | null>;
  isReviewExists(revId: string): Promise<IReview | null>;
} & Model<IReview, Record<string, unknown>>;
