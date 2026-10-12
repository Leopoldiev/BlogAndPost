import { Express } from 'express';
import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { COMMENTS_PATH } from '../../../src/comments/constants/comments-paths';
import { CommentViewModel } from '../../../src/comments/routes/output/comment.view-model';

export const createComment = async (
  app: Express,
  postId: string,
  token: string,
): Promise<CommentViewModel> => {
  const createCommentResponse = await request(app)
    .post(`${POSTS_PATH}/${postId}${COMMENTS_PATH}`)
    .set({ Authorization: `Bearer ${token}` })
    .send({ content: 'That was a good saturday day in London' })
    .expect(HTTP_STATUSES.CREATED_201);

  expect(createCommentResponse.body).toBeDefined();

  return createCommentResponse.body;
};
