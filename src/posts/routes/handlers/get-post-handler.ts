import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostViewModel } from '../../types/postViewModel';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { postsQueryRepository } from '../../repositories/posts.query-repository';

export const getPostHandler = async (
  req: Request<{ id: string }>,
  res: Response<PostViewModel>,
) => {
  try {
    const id = req.params.id;
    const foundedPost = await postsQueryRepository.findByIdOrFail(id);
    const post = postsQueryRepository.mapToPostViewModel(foundedPost);
    res.status(HTTP_STATUSES.OK_200).send(post);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
