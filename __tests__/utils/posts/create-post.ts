import { Express } from 'express';
import request from 'supertest';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { PostViewModel } from '../../../src/posts/types/postViewModel';
import { getPostInputDto } from './get-post-input-dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { createBlog } from '../blogs/create-blog';
import { getBlogInputDto } from '../blogs/get-blog-input-dto';
import { BlogCreateUpdateDto } from '../../../src/blogs/application/dtos/blog-create-update.dto';
import { PostCreateUpdateDto } from '../../../src/posts/application/dtos/post-create-update.dto';

export const createPost = async (
  app: Express,
  blogId?: string,
): Promise<PostViewModel> => {
  const defaultBlogData: BlogCreateUpdateDto = getBlogInputDto();
  const createdBlog = await createBlog(app, defaultBlogData);

  const testPostData: PostCreateUpdateDto = getPostInputDto(
    blogId || createdBlog.id,
  );

  const createPostResponse = await request(app)
    .post(`${POSTS_PATH}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HTTP_STATUSES.CREATED_201);

  expect(createPostResponse.body).toBeDefined();

  return createPostResponse.body;
};
