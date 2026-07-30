import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { PostInputDto } from '../../dto/post-input-dto';
import { postsRepository } from '../../repositories/posts-repository';
import { blogsRepository } from '../../../blogs/repositories/blogs-repository';

export const updatePostHandler = async (
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) => {
  const post = await postsRepository.findById(req.params.id);
  const blog = await blogsRepository.findById(req.body.blogId);

  if (post && blog) {
    const updatedPost: PostInputDto = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    };

    await postsRepository.update(req.params.id, updatedPost);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Post not found' }]));
};
