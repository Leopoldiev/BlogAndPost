import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/exceptions/errors.handler';

import { authUserService } from '../../application/auth.service';
import { UserLoginDto } from '../../application/dtos/user-login.dto';

export const loginUserHandler = async (
  req: Request<{}, {}, UserLoginDto>,
  res: Response<void>,
) => {
  try {
    await authUserService.login(req.body);
    res.status(HTTP_STATUSES.NO_CONTENT_204).send();
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
