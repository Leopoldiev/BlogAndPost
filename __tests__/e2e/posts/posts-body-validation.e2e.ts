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
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { createPost } from '../../utils/posts/create-post';

dotenv.config();

describe('Posts API', () => {
  const app = express();
  setupApp(app);

  let correctTestPostInputData = {};

  beforeAll(async () => {
    await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);

    const createdBlog = await createBlog(app);
    correctTestPostInputData = getPostInputDto(createdBlog.id);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should not create new post when incorrect body passed; POST /posts', async () => {
    await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostInputData)
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);

    const invalidDataSet = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        title: ' ', // empty string
        shortDescription: ' ', // empty string
        content: ' ', // empty string
        blogId: ' ', // empty string
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet.body.errorsMessages).toHaveLength(4);
  });

  it('Should not update post when incorrect body passed; UPDATE /pasts', async () => {
    const createdPost = await createPost(app);

    await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .send(correctTestPostInputData)
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);

    const invalidDataSet = await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        title: ' ', // empty string
        shortDescription: ' ', // empty string
        content: ' ', // empty string
        blogId: ' ', // empty string
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet.body.errorsMessages).toHaveLength(4);
  });
});
