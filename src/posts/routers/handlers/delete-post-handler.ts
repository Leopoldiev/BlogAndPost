import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { postsRepository } from '../../repositories/posts-repository';

export const deletePostHandler = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const isDeleted = postsRepository.delete(req.params.id);

  if (isDeleted) {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Post not found' }]));
};
