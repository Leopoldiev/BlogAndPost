import dotenv from 'dotenv';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createBlog } from '../../utils/blogs/create-blog';
import { getPostInputDto } from '../../utils/posts/get-post-input-dto';
import {
  POSTS_PATH,
  POSTS_ROUTES,
} from '../../../src/posts/constants/posts-paths';
import { appConfig } from '../../../src/core/config/config';
import { createPost } from '../../utils/posts/create-post';
import { COMMENTS_PATH } from '../../../src/comments/constants/comments-paths';
import { generateJwtAuthToken } from '../../utils/generate-jwt-auth-token';

dotenv.config();

describe('Comments API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(appConfig.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should not create new comment when incorrect body passed; POST /posts/{postId}/comments', async () => {
    await request(app)
      .post(`${POSTS_PATH}${POSTS_ROUTES.BY_ID}${COMMENTS_PATH}`)
      .send({ content: 'New comment' })
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);

    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    const token = await generateJwtAuthToken(app);

    const invalidDataSet = await request(app)
      .post(`${POSTS_PATH}/${createdPost.id.toString()}${COMMENTS_PATH}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ content: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet.body.errorsMessages).toHaveLength(1);
  });
});
