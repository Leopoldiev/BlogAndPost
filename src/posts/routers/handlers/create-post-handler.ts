import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostInputDto } from '../../dto/post-input-dto';
import { Post } from '../../types/post';
import { postsRepository } from '../../repositories/posts-repository';

export const createPostHandler = (
  req: Request<{}, {}, PostInputDto>,
  res: Response<Post>,
) => {
  const newPost: PostInputDto = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  };

  const createdPost = postsRepository.create(newPost);
  res.status(HTTP_STATUSES.CREATED_201).send(createdPost);
};
