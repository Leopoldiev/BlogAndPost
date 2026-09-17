import dotenv from 'dotenv';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { getBlogInputDto } from '../../utils/blogs/get-blog-input-dto';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createBlog } from '../../utils/blogs/create-blog';
import { BlogCreateUpdateDto } from '../../../src/blogs/application/dtos/blog-create-update.dto';

dotenv.config();

describe('Blogs API', () => {
  const app = express();
  setupApp(app);

  const correctTestBlogInputData: BlogCreateUpdateDto = getBlogInputDto();

  beforeAll(async () => {
    await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should not create new blog when incorrect body passed; POST /blogs', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogInputData)
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);

    const invalidDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: ' ', // empty string
        description: ' ', // empty string
        websiteUrl: ' ', // empty string
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet.body.errorsMessages).toHaveLength(3);
  });

  it('Should not update blog when incorrect body passed; UPDATE /blogs', async () => {
    const createdBlog = await createBlog(app, correctTestBlogInputData);

    await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .send(correctTestBlogInputData)
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);

    const invalidDataSet = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: ' ', // empty string
        description: ' ', // empty string
        websiteUrl: ' ', // empty string
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet.body.errorsMessages).toHaveLength(3);
  });
});
