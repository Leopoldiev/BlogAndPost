import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { BlogCreateUpdateDto } from '../../application/dtos/blog-create-update.dto';
import { blogsService } from '../../application/blogs.service';
import { BlogViewModel } from '../output/blog.view-model';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { blogsQueryRepository } from '../../repositories/blogs.query-repository';

export const createBlogHandler = async (
  req: Request<{}, {}, BlogCreateUpdateDto>,
  res: Response<BlogViewModel>,
) => {
  try {
    const createdBlogId = await blogsService.create(req.body);
    const foundedBlog =
      await blogsQueryRepository.findByIdOrFail(createdBlogId);

    const createdBlog = blogsQueryRepository.mapToBlogViewModel(foundedBlog);
    res.status(HTTP_STATUSES.CREATED_201).send(createdBlog);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
