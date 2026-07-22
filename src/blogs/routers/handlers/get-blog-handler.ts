import { Request, Response } from 'express';
import { Blog } from '../../types/blog';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { FieldError } from '../../../core/types/field-error';

export const getBlogHandler = (
  req: Request<{ id: string }>,
  res: Response<Blog | { errorsMessages: FieldError[] | null }>,
) => {
  const blog = blogsRepository.findById(req.params.id);

  if (blog) {
    res.status(HTTP_STATUSES.OK_200).send(blog);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Video not found' }]));
};
