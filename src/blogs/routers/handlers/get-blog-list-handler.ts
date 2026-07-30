import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs-repository';
import { BlogViewModel } from '../../types/blogViewModel';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export const getBlogListHandler = async (
  _req: Request,
  res: Response<BlogViewModel[] | []>,
) => {
  const blogs = await blogsRepository.findAll();
  const blogsViewModels = blogs.map(mapToBlogViewModel);
  res.status(HTTP_STATUSES.OK_200).send(blogsViewModels);
};
