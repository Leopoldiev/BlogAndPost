import { setupApp } from '../../../src/setup-app';
import request from 'supertest';
import express from 'express';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-dto';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { ObjectId } from 'mongodb';
import { updateBlog } from '../../utils/blogs/update-blog';

describe('Blogs API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should create correct blog in MongoDB; POST /blogs', async () => {
    const newBlog: BlogInputDto = {
      name: 'NodeJs',
      description: 'Learn coding',
      websiteUrl: 'https://nodejs.org/',
    };

    await createBlog(app, newBlog);
  });

  it('Should return all blogs from MongoDB; GET /blogs', async () => {
    await createBlog(app);
    await createBlog(app);

    const response = await request(app)
      .get(BLOGS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('Should return existing blog from MongoDB by id; GET /blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blog = await getBlogById(app, createdBlog.id);

    expect(blog).toEqual({
      ...createdBlog,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('Should not return blog with unexisting id from MongoDB by id; GET /blogs/{id}', async () => {
    await createBlog(app);

    const nonExistingId = new ObjectId().toString();

    await request(app)
      .get(`${BLOGS_PATH}/${nonExistingId}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should update correct blog from MongoDB by id; PUT /blogs/{id}', async () => {
    const createdBlog = await createBlog(app);

    const blogUpdateData: BlogInputDto = {
      name: 'New name',
      description: 'New description',
      websiteUrl: 'https://new.org/',
    };

    await updateBlog(app, createdBlog.id, blogUpdateData);

    const blogResponse = await getBlogById(app, createdBlog.id);

    expect(blogResponse).toEqual({
      id: expect.any(String),
      name: blogUpdateData.name,
      description: blogUpdateData.description,
      websiteUrl: blogUpdateData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });

  it('Should not update blog with unexisting id; PUT /blogs/{id}', async () => {
    const blogUpdateData: BlogInputDto = {
      name: 'New name',
      description: 'New description',
      websiteUrl: 'https://new.org/',
    };

    const nonExistingId = new ObjectId().toString();

    await request(app)
      .put(`${BLOGS_PATH}/${nonExistingId}`)
      .set('Authorization', generateBasicAuthToken())
      .send(blogUpdateData)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should delete blog from MongoDB by id; DELETE /blogs/{id}', async () => {
    const createdBlog = await createBlog(app);

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should not delete unexisting blog from MongoDB by id; DELETE /blogs/{id}', async () => {
    const nonExistingId = new ObjectId().toString();

    await request(app)
      .delete(`${BLOGS_PATH}/${nonExistingId}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
