import { Response } from 'express';
import { RequestWithUserId } from '../../../core/types/requests';
import { IdType } from '../../../core/types/id';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { usersQueryRepository } from '../../../users/repositories/users.query-repository';

export const meUserHandler = async (
  req: RequestWithUserId<IdType>,
  res: Response,
) => {
  const userId = req.user?.id as string;

  if (!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  const foundedUser = await usersQueryRepository.findByIdOrFail(userId);
  const me = usersQueryRepository.mapToMeViewModel(foundedUser);
  return res.status(HTTP_STATUSES.OK_200).send(me);
};
