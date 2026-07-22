import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog-input-dto';
import { Blog } from '../../types/blog';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';

export const createBlogHandler = (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<Blog>,
) => {
  const createBlog = blogsRepository.create(req.body);
  res.status(HTTP_STATUSES.CREATED_201).send(createBlog);
};
