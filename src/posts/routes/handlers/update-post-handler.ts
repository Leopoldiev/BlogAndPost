import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostCreateUpdateDto } from '../../application/dtos/post-create-update.dto';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/exceptions/errors.handler';

export const updatePostHandler = async (
  req: Request<{ id: string }, {}, PostCreateUpdateDto>,
  res: Response,
) => {
  try {
    await postsService.update(req.params.id, req.body);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
