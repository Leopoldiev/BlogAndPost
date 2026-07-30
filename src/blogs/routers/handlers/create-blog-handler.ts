import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog-input-dto';
import { BlogViewModel, BlogDBModel } from '../../types/blogViewModel';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { mapBlogInputDtoToBlog } from '../mappers/map-blog-input-dto-to-blog';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export const createBlogHandler = async (
  req: Request<{}, {}, BlogInputDto>,
  res: Response<BlogViewModel>,
) => {
  const createdDate = new Date();

  const newBlog: BlogDBModel = {
    ...mapBlogInputDtoToBlog(req.body),
    createdAt: createdDate.toISOString(),
  };

  const createdBlog = await blogsRepository.create(newBlog);

  if (!createdBlog) {
    throw new Error('Blog not found');
  }
  const blogViewModel = mapToBlogViewModel(createdBlog);
  res.status(HTTP_STATUSES.CREATED_201).send(blogViewModel);
};
