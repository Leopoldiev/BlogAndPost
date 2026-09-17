import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { BlogCreateUpdateDto } from '../../application/dtos/blog-create-update.dto';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/exceptions/errors.handler';

export const updateBlogHandler = async (
  req: Request<{ id: string }, {}, BlogCreateUpdateDto>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    await blogsService.update(id, req.body);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
