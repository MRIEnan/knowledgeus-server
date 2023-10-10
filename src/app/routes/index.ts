import express from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ReviewRouter } from '../modules/review/review.route';
import { BookRouter } from '../modules/book/book.route';
import { WishlistRouter } from '../modules/wishList/wishlist.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/books',
    route: BookRouter,
  },
  {
    path: '/reviews',
    route: ReviewRouter,
  },
  {
    path: '/wishlists',
    route: WishlistRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
