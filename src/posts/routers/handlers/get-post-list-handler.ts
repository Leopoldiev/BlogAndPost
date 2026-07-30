import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostViewModel } from '../../types/postViewModel';
import { postsRepository } from '../../repositories/posts-repository';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export const getPostListHandler = async (
  _req: Request,
  res: Response<PostViewModel[] | []>,
) => {
  const posts = await postsRepository.findAll();
  const postsViewModels = posts.map(mapToPostViewModel);
  res.status(HTTP_STATUSES.OK_200).send(postsViewModels);
};
