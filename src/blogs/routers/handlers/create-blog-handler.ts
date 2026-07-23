import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog-input-dto';
import { Blog } from '../../types/blog';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';

export const createBlogHandler = (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<Blog>,
) => {
  const newBlog: BlogInputDto = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };
  const createdBlog = blogsRepository.create(newBlog);
  res.status(HTTP_STATUSES.CREATED_201).send(createdBlog);
};
