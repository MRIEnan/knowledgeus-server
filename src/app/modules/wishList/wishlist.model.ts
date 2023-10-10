import { Schema, model } from 'mongoose';
import { IWishlist, WishListModel } from './wishlist.interface';
import { EWishlist } from './wishlist.constant';

const wishlistSchema = new Schema<IWishlist, WishListModel>(
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
    status: {
      type: String,
      enum: EWishlist,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Wishlist = model<IWishlist, WishListModel>(
  'Wishlist',
  wishlistSchema,
);
