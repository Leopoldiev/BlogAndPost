import { Express } from 'express';
import { BlogViewModel } from '../../../src/blogs/types/blogViewModel';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';

export const getBlogById = async (
  app: Express,
  blogId: string,
): Promise<BlogViewModel> => {
  const response = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HTTP_STATUSES.OK_200);

  return response.body;
};
