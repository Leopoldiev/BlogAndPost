import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../core/types/http-statuses';

const USERNAME = process.env.USERNAME || 'leo';
const PASSWORD = process.env.PASSWORD || 'qwerty';

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
    'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

  if (auth !== authorizationKey) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  next();
};
