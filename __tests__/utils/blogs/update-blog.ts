import { Express } from 'express';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-dto';
import { getBlogInputDto } from './get-blog-input-dto';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import request from 'supertest';

export const updateBlog = async (
  app: Express,
  blogId: string,
  blogUpdateDto?: BlogInputDto,
): Promise<void> => {
  const defaultBlogData: BlogInputDto = getBlogInputDto();

  const testBlogData = { ...defaultBlogData, ...blogUpdateDto };

  const response = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HTTP_STATUSES.NO_CONTENT_204);

  return response.body;
};
