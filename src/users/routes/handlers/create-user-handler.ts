import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { UserCreateDto } from '../../application/dtos/user-create.dto';
import { usersService } from '../../application/users.service';
import { RequestWithBody } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const createUserHandler = async (
  req: RequestWithBody<UserCreateDto>,
  res: Response,
) => {
  const result = await usersService.create(req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.CREATED_201).send(result.data);
};
