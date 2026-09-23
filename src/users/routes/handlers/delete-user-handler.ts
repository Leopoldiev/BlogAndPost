import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { usersService } from '../../application/users.service';

export const deleteUserHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    await usersService.delete(id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
