import { Express } from 'express';
import request from 'supertest';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { PostInputDto } from '../../../src/posts/dto/post-input-dto';
import { PostViewModel } from '../../../src/posts/types/postViewModel';
import { getPostInputDto } from './get-post-input-dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { createBlog } from '../blogs/create-blog';
import { getBlogInputDto } from '../blogs/get-blog-input-dto';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-dto';

export const createPost = async (app: Express): Promise<PostViewModel> => {
  const defaultBlogData: BlogInputDto = getBlogInputDto();
  const createdBlog = await createBlog(app, defaultBlogData);

  const testPostData: PostInputDto = getPostInputDto(createdBlog.id);

  const createPostResponse = await request(app)
    .post(`${POSTS_PATH}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HTTP_STATUSES.CREATED_201);

  expect(createPostResponse.body).toBeDefined();

  return createPostResponse.body;
};
