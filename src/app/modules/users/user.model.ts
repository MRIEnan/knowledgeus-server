/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { ENUM_USER_ROLE } from '../../../enums/users';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ENUM_USER_ROLE,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// static methods ->
userSchema.statics.isUserExistByIdInBool = async function (
  id: string,
): Promise<boolean> {
  const result = await User.findOne({ _id: id });
  return result ? true : false;
};

// static methods ->
userSchema.statics.isUserExist = async function (
  email: string,
): Promise<Pick<IUser, '_id' | 'id' | 'password' | 'role' | 'email'> | null> {
  return await User.findOne(
    { email: email },
    { _id: 1, id: 1, password: 1, needsPasswordChange: 1, role: 1 },
  ).lean();
};

// static methods ->
userSchema.statics.isUserExistWithId = async function (
  id: string,
): Promise<Pick<IUser, '_id' | 'id' | 'password' | 'role' | 'email'> | null> {
  return await User.findOne(
    { _id: id },
    { _id: 1, id: 1, password: 1, needsPasswordChange: 1, role: 1 },
  ).lean();
};

//  static method   -> check password match
userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  // hashing user password
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date();
  }
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
