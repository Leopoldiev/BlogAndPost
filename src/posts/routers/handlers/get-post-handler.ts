import { Request, Response } from 'express';
import { FieldError } from '../../../core/types/field-error';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { PostViewModel } from '../../types/postViewModel';
import { postsRepository } from '../../repositories/posts-repository';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export const getPostHandler = async (
  req: Request<{ id: string }>,
  res: Response<PostViewModel | { errorsMessages: FieldError[] | null }>,
) => {
  const post = await postsRepository.findById(req.params.id);

  if (post) {
    const postViewModel = mapToPostViewModel(post);
    res.status(HTTP_STATUSES.OK_200).send(postViewModel);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Post not found' }]));
};
