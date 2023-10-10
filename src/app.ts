/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import ApiError from './errors/ApiError';
import routes from './app/routes';
import httpStatus from 'http-status';
import config from './config';
import cookieParser from 'cookie-parser';
const corsHandler = cors({
  origin: ['http://localhost:3000', 'https://restora-6f0c3.web.app'],
  credentials: true,
});

const app: Application = express();

app.use(corsHandler);
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1', routes);

app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: config.env !== 'production' ? req.originalUrl : '.',
        message: 'Api Not Found',
      },
    ],
  });
  next();
});

export default app;
