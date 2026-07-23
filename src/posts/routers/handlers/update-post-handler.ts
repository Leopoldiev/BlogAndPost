import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { PostInputDto } from '../../dto/post-input-dto';
import { postsRepository } from '../../repositories/posts-repository';

export const updatePostHandler = (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) => {
  const post = postsRepository.findById(req.params.id);

  if (post) {
    const updatedPost: PostInputDto = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    };

    postsRepository.update(req.params.id, updatedPost);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Post not found' }]));
};
