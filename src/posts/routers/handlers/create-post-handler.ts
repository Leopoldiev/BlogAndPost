import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostInputDto } from '../../dto/post-input-dto';
import { PostDBModel, PostViewModel } from '../../types/postViewModel';
import { postsRepository } from '../../repositories/posts-repository';
import { mapPostInputDtoToPostDbModel } from '../mappers/map-post-input-dto-to-post-db-model';
import { blogsRepository } from '../../../blogs/repositories/blogs-repository';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export const createPostHandler = async (
  req: Request<{}, {}, PostInputDto>,
  res: Response<PostViewModel>,
) => {
  const createdDate = new Date();
  const blog = await blogsRepository.findById(req.body.blogId);

  if (blog) {
    const newPost: PostDBModel = {
      ...mapPostInputDtoToPostDbModel(req.body),
      blogName: blog.name,
      createdAt: createdDate.toISOString(),
    };

    const createdPost = await postsRepository.create(newPost);

    if (!createdPost) {
      throw new Error('Inserted post was not found');
    }

    const postViewModel = mapToPostViewModel(createdPost);
    res.status(HTTP_STATUSES.CREATED_201).send(postViewModel);
  }
};
