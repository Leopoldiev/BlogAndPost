import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../core/types/http-statuses';

export const protectedRouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  const authorizationKey =
    'Basic ' +
    Buffer.from(`${process.env.USER}:${process.env.PASSWORD}`).toString(
      'base64',
    );

  if (auth !== authorizationKey) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  next();
};
