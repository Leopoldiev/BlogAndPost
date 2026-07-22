import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { Post } from '../../types/post';
import { postsRepository } from '../../repositories/posts-repository';

export const getPostListHandler = (
  _req: Request,
  res: Response<Post[] | []>,
) => {
  res.status(HTTP_STATUSES.OK_200).send(postsRepository.findAll());
};
