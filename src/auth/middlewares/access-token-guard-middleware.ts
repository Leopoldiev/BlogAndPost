import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../application/jwt.service';
import { IdType } from '../../core/types/id';
import { HTTP_STATUSES } from '../../core/types/http-statuses';

export const accessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization)
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer')
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const payload = await jwtService.verifyToken(token);

  if (payload) {
    const { userId } = payload;

    req.user = { id: userId } as IdType;
    next();

    return;
  }
  res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  return;
};
