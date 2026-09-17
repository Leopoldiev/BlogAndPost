import { Request, Response } from 'express';
import { BlogViewModel } from '../output/blog.view-model';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { blogsQueryRepository } from '../../repositories/blogs.query-repository';

export const getBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response<BlogViewModel>,
) => {
  try {
    const id = req.params.id;
    const foundedBlog = await blogsQueryRepository.findByIdOrFail(id);
    const blog = blogsQueryRepository.mapToBlogViewModel(foundedBlog);
    res.status(HTTP_STATUSES.OK_200).send(blog);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
