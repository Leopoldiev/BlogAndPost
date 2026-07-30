import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const blog = await blogsRepository.findById(req.params.id);

  if (blog) {
    await blogsRepository.delete(req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Blog not found' }]));
};
