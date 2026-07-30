import { NextFunction, Request, Response } from 'express';

export const globalErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  res.status(500).json({
    errorsMessages: [
      {
        message: 'Internal server error',
        field: null,
      },
    ],
  });
};
