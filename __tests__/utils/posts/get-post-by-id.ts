import { Express } from 'express';
import request from 'supertest';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { PostViewModel } from '../../../src/posts/types/postViewModel';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';

export const getPostById = async (
  app: Express,
  postId: string,
): Promise<PostViewModel> => {
  const response = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HTTP_STATUSES.OK_200);

  return response.body;
};
