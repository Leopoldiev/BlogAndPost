import { Request, Response } from 'express';
import { BlogViewModel } from '../../types/blogViewModel';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { FieldError } from '../../../core/types/field-error';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export const getBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response<BlogViewModel | { errorsMessages: FieldError[] | null }>,
) => {
  const blog = await blogsRepository.findById(req.params.id);

  if (blog) {
    const blogViewModel = mapToBlogViewModel(blog);
    res.status(HTTP_STATUSES.OK_200).send(blogViewModel);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Blog not found' }]));
};
