import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
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

reviewSchema.statics.isThisReviewer = async function (
  revId: string,
  userId: string,
): Promise<IReview | null> {
  const result = await this.findOne({ _id: revId });
  if (result && String(result.userId) == userId) {
    return result;
  }
  return null;
};
reviewSchema.statics.isReviewExists = async function (
  revId: string,
): Promise<IReview | null> {
  const result = await this.findOne({ _id: revId });
  return result;
};

export const Review = model<IReview, ReviewModel>(
  'Review',
  reviewSchema,
  'review',
);
