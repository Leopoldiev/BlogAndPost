import { Express } from 'express';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-dto';
import { BlogViewModel } from '../../../src/blogs/types/blogViewModel';
import { getBlogInputDto } from './get-blog-input-dto';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';

export const createBlog = async (
  app: Express,
  blogDto?: BlogInputDto,
): Promise<BlogViewModel> => {
  const defaultBlogData: BlogInputDto = getBlogInputDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createBlogResponse = await request(app)
    .post(`${BLOGS_PATH}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HTTP_STATUSES.CREATED_201);

  expect(createBlogResponse.body).toBeDefined();

  return createBlogResponse.body;
};
