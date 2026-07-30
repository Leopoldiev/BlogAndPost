import { Express } from 'express';
import request from 'supertest';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-dto';

export const updatePost = async (
  app: Express,
  postId: string,
  postUpdateDto?: PostInputDto,
): Promise<void> => {
  const response = await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(postUpdateDto)
    .expect(HTTP_STATUSES.NO_CONTENT_204);

  return response.body;
};
