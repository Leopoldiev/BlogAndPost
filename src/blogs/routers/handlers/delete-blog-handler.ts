import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';

export const deleteBlogHandler = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const isDeleted = blogsRepository.delete(req.params.id);

  if (isDeleted) {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Blog not found' }]));
};
