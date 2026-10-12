import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { BlogCreateUpdateDto } from '../../application/dtos/blog-create-update.dto';
import { blogsService } from '../../application/blogs.service';
import { RequestWithBody } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const createBlogHandler = async (
  req: RequestWithBody<BlogCreateUpdateDto>,
  res: Response,
) => {
  const result = await blogsService.create(req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.CREATED_201).send(result.data);
};
