import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog-input-dto';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';

export const updateBlogHandler = (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response,
) => {
  const isUpdated = blogsRepository.update(req.params.id, req.body);

  if (isUpdated) {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Blog not found' }]));
};
