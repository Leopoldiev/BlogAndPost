import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';

import { authUserService } from '../../application/auth.service';
import { UserLoginDto } from '../../application/dtos/user-login.dto';
import { RequestWithBody } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';
import { ExtensionType } from '../../../core/result/result.type';

export const loginUserHandler = async (
  req: RequestWithBody<UserLoginDto>,
  res: Response<{ accessToken: string } | ExtensionType[]>,
) => {
  const result = await authUserService.login(req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res
    .status(HTTP_STATUSES.OK_200)
    .send({ accessToken: result.data!.accessToken });
};
