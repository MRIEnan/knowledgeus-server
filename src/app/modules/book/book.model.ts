import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';

const bookSchema = new Schema<IBook, BookModel>(
  {
    accessIds: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    imageLink: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: [String],
      required: true,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: false,
    },
    updatedAt: {
      type: String,
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

// isUserAuthorized: (id: string) => Promise<boolean>;
// isBookMatched: (title:string,description:string) => Promise<boolean>;
// isBookExists: (id: string) => Promise<boolean>;

bookSchema.statics.isBookMatched = async function (
  title: string,
  description: string,
): Promise<boolean> {
  const isMatched = await this.findOne({
    title: title,
    description: description,
  });
  return isMatched ? true : false;
};

bookSchema.statics.isBookExistsWithIdInBool = async function (
  id: string,
): Promise<boolean> {
  const isExist = await this.findOne({ _id: id });
  return isExist ? true : false;
};

bookSchema.statics.isBookExists = async function (
  id: string,
): Promise<Pick<IBook, 'accessIds' | 'createdAt'> | null> {
  const isExist = await this.findOne(
    { _id: id },
    { accessIds: 1, createdAt: 1 },
  ).lean();
  return isExist;
};

export const Book = model<IBook, BookModel>('Book', bookSchema, 'book');
