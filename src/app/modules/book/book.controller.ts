import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BookConstant } from './book.constant';
import { IBook } from './book.interface';
import { BookService } from './book.service';
import { Request, Response } from 'express';

const createBook = catchAsync(async (req, res) => {
  const userInfo = req.user;
  if (!userInfo) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not logged in');
  }

  const { ...bookData } = req.body;

  const result = await BookService.createBook(bookData, userInfo);
  sendResponse<IBook>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Book created successfully',
    data: result,
  });
});

const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BookConstant.bookFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookService.getAllBook(filters, paginationOptions);

  sendResponse<IBook[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Book retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookService.getSingleBook(id);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { ...updatedData } = req.body;
  const userInfo = req.user;

  if (!userInfo) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
  }

  const result = await BookService.updateBook(id, updatedData, userInfo);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.id;
  const userInfo = req.user;

  if (!userInfo) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
  }

  const result = await BookService.deleteBook(userInfo, bookId);

  sendResponse<IBook | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully',
    data: result,
  });
});

export const BookController = {
  createBook,
  getAllBook,
  getSingleBook,
  updateBook,
  deleteBook,
};
