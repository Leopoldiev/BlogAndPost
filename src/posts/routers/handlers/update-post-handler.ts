import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { PostInputDto } from '../../dto/post-input-dto';
import { postsRepository } from '../../repositories/posts-repository';

export const updatePostHandler = (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) => {
  const isUpdated = postsRepository.update(req.params.id, req.body);

  if (isUpdated) {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Post not found' }]));
};
