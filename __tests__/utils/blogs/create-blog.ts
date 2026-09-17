import { Express } from 'express';
import { BlogViewModel } from '../../../src/blogs/routes/output/blog.view-model';
import { getBlogInputDto } from './get-blog-input-dto';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { BlogCreateUpdateDto } from '../../../src/blogs/application/dtos/blog-create-update.dto';

export const createBlog = async (
  app: Express,
  blogDto?: BlogCreateUpdateDto,
): Promise<BlogViewModel> => {
  const defaultBlogData: BlogCreateUpdateDto = getBlogInputDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createBlogResponse = await request(app)
    .post(`${BLOGS_PATH}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HTTP_STATUSES.CREATED_201);

  expect(createBlogResponse.body).toBeDefined();

  return createBlogResponse.body;
};
