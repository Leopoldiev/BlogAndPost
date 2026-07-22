import { Request, Response } from 'express';
import { FieldError } from '../../../core/types/field-error';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { Post } from '../../types/post';
import { postsRepository } from '../../repositories/posts-repository';

export const getPostHandler = (
  req: Request<{ id: string }>,
  res: Response<Post | { errorsMessages: FieldError[] | null }>,
) => {
  const post = postsRepository.findById(req.params.id);

  if (post) {
    res.status(HTTP_STATUSES.OK_200).send(post);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Post not found' }]));
};
