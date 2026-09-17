import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostCreateUpdateDto } from '../../application/dtos/post-create-update.dto';
import { PostViewModel } from '../../types/postViewModel';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { postsQueryRepository } from '../../repositories/posts.query-repository';

export const createPostHandler = async (
  req: Request<{}, {}, PostCreateUpdateDto>,
  res: Response<PostViewModel>,
) => {
  try {
    const createdPostId = await postsService.create(req.body);
    const foundedPost =
      await postsQueryRepository.findByIdOrFail(createdPostId);
    const createdPost = postsQueryRepository.mapToPostViewModel(foundedPost);
    res.status(HTTP_STATUSES.CREATED_201).send(createdPost);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
