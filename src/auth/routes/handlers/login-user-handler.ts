import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { UserLoginDto } from '../../application/dtos/user-login.dto';
import { authUserService } from '../../application/auth.service';

export const loginUserHandler = async (
  req: Request<{ dto: UserLoginDto }>,
  res: Response<void>,
) => {
  try {
    await authUserService.login(req.body.dto);
    res.status(HTTP_STATUSES.NO_CONTENT_204).send();
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
