import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs-repository';
import { Blog } from '../../types/blog';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';

export const getBlogListHandler = (
  _req: Request,
  res: Response<Blog[] | []>,
) => {
  res.status(HTTP_STATUSES.OK_200).send(blogsRepository.findAll());
};
