import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { UserCreateDto } from '../../application/dtos/user-create.dto';
import { UserViewModel } from '../output/user.view-model';
import { usersService } from '../../application/users.service';
import { usersQueryRepository } from '../../repositories/users.query-repository';

export const createUserHandler = async (
  req: Request<{}, {}, UserCreateDto>,
  res: Response<UserViewModel>,
) => {
  try {
    const createdUserId = await usersService.create(req.body);
    const foundedUser =
      await usersQueryRepository.findByIdOrFail(createdUserId);

    const createdUser = usersQueryRepository.mapToUserViewModel(foundedUser);
    res.status(HTTP_STATUSES.CREATED_201).send(createdUser);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
