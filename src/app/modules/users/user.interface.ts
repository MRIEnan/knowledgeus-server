/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
  _id?: Types.ObjectId;
  id: string;
  email: string;
  userName: string;
  role: 'general' | 'admin';
  password: string;
  createdAt?: string;
  updatedAt?: string;
  needsPasswordChange: true | false;
  passwordChangedAt?: Date;
};

export type UserModel = {
  isUserExistWithId(
    id: string,
  ): Promise<Pick<
    IUser,
    '_id' | 'id' | 'password' | 'role' | 'needsPasswordChange'
  > | null>;
  isUserExistByIdInBool(id: string): Promise<boolean>;
  isUserExist(
    email: string,
  ): Promise<Pick<
    IUser,
    '_id' | 'id' | 'password' | 'role' | 'needsPasswordChange'
  > | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser, Record<string, unknown>>;
