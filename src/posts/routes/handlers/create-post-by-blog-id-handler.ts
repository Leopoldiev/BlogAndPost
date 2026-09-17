import { Request, Response } from 'express';
import { PostViewModel } from '../../types/postViewModel';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostCreateUpdateDto } from '../../application/dtos/post-create-update.dto';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { postsService } from '../../application/posts.service';

export const createPostByBlogId = async (
  req: Request<{ id: string }, {}, Omit<PostCreateUpdateDto, 'blogId'>>,
  res: Response<PostViewModel>,
) => {
  try {
    const inputDto = req.body;
    const id = req.params.id;

    const postList = await postsService.createPostByBlogId(id, inputDto);
    res.status(HTTP_STATUSES.CREATED_201).send(postList);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
