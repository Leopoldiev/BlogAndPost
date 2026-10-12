import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostCreateUpdateDto } from '../../application/dtos/post-create-update.dto';
import { postsService } from '../../application/posts.service';
import { RequestWithParamsAndBody } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const createPostByBlogIdHandler = async (
  req: RequestWithParamsAndBody<
    { id: string },
    Omit<PostCreateUpdateDto, 'blogId'>
  >,
  res: Response,
) => {
  const inputDto = req.body;
  const id = req.params.id;

  const result = await postsService.createPostByBlogId(id, inputDto);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.CREATED_201).send(result.data);
};
