/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IUser } from '../users/user.interface';

export type IBook = {
  _id?: Types.ObjectId;
  accessIds: Types.ObjectId | IUser;
  imageLink: string;
  title: string;
  description: string;
  author: string[];
  publicationDate: string;
  genre: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BookModel = {
  isUserAuthorized: (id: string) => Promise<boolean>;
  isBookMatched: (title: string, description: string) => Promise<boolean>;
  isBookExists: (id: string) => Promise<Pick<IBook, 'accessIds' | 'createdAt'>>;
  isBookExistsWithIdInBool(id: string): Promise<boolean>;
} & Model<IBook, Record<string, unknown>>;

export type IBookFilterableFields = {
  searchTerm?: string;
  title?: string;
  author?: string;
  genre?: string;
};

export type IBookSearchableFields = {
  searchTerm?: string;
  title?: string;
  author?: string;
  genre?: string;
  description?: string;
};
