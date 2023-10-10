import mongoose, { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOption } from '../../../interfaces/pagination';
import { BookConstant } from './book.constant';
import { IBook, IBookFilterableFields } from './book.interface';
import { Book } from './book.model';
import { User } from '../users/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { genPublicationDate } from '../../../helpers/genPublicationDate';
import { Review } from '../review/review.model';

const createBook = async (
  payload: IBook,
  userInfo: JwtPayload,
): Promise<IBook | null> => {
  const isExist = await User.isUserExistWithId(userInfo.oId);
  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  const isBookMatched = await Book.isBookMatched(
    payload.title,
    payload.description,
  );

  if (isBookMatched) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Plagiarism detected');
  }

  //   setting publication data
  payload['publicationDate'] = genPublicationDate(new Date());

  // checking if image is exist : if not the give an placeholder image
  if (!payload.imageLink) {
    payload['imageLink'] =
      'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&fit=clip';
  }

  const result = (await Book.create(payload)).populate({ path: 'accessIds' });
  return result;
};

const getAllBook = async (
  filters: IBookFilterableFields,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: BookConstant.bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: [value],
      })),
    });
  }
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const isExist = await Book.isBookExists(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Book');
  }

  const result = await Book.findById(id).populate({ path: 'accessIds' });
  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<IBook>,
  userInfo: JwtPayload,
): Promise<IBook | null> => {
  if (!payload) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request');
  }

  //  if user exists
  const isUserExist = await User.isUserExistWithId(userInfo.oId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  //   if book exits
  const isBookExists = await Book.isBookExists(id);
  if (!isBookExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Book');
  }

  // if the user has access of this book
  if (String(isBookExists.accessIds) != String(userInfo.oId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden request');
  }

  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteBook = async (
  userInfo: JwtPayload,
  bookId: string,
): Promise<IBook | null> => {
  const isUserExist = await User.isUserExistWithId(userInfo.oId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  const isBookExists = await Book.isBookExists(bookId);
  if (!isBookExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Book');
  }

  // if the user has access of this book
  if (String(isBookExists.accessIds) != String(userInfo.oId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden request');
  }
  let newBook = null;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const reviews = await Review.find({ bookId: bookId })
      .session(session)
      .lean();

    if (reviews.length) {
      reviews.forEach(
        async rev =>
          await Review.findOneAndDelete({ _id: rev._id }, { session: session }),
      );
    }

    const result = await Book.findOneAndDelete(
      { _id: bookId },
      { session: session },
    );

    newBook = result;

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  if (newBook) {
    return newBook;
  } else {
    return null;
  }
};

export const BookService = {
  createBook,
  getAllBook,
  getSingleBook,
  updateBook,
  deleteBook,
};

// let newUserAllData = null;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
// generate student id
//     const id = await generateStudentId(academicSemester);
//     user.id = id;
//     student.id = id;

//     const newStudent = await Student.create([student], { session });

//     if (!newStudent.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student!');
//     }

// set student _id into user
//     user.student = newStudent[0]._id;

//     const newUser = await User.create([user], { session });
//     if (!newUser.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user!');
//     }
//     newUserAllData = newUser[0];

//     await session.commitTransaction();
//     await session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw error;
//   }

// user --> student -> academicSemester, academicDepartment, academicFaculty
//  if (newUserAllData) {
//   newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
//     path: 'student',
//     populate: [
//       { path: 'academicSemester' },
//       { path: 'academicDepartment' },
//       { path: 'academicFaculty' },
//     ],
//   });
