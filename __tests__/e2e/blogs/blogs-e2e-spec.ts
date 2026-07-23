import { setupApp } from '../../../src/setup-app';
import request from 'supertest';
import express from 'express';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-dto';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { db } from '../../../src/db/in-memory-db';

describe('Blogs API', () => {
  const app = express();
  setupApp(app);

  const correctTestBlogData: BlogInputDto = {
    name: 'JavaScript',
    description: 'Computer Science',
    webSiteUrl: 'https://learnjavascript.ru',
  };

  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it('Should return all blogs from DB; GET /blogs', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const blogsResponse = await request(app)
      .get(BLOGS_PATH)
      .expect(HTTP_STATUSES.OK_200);
    expect(blogsResponse.body.length).toBe(2);
  });

  it('Should return existing blog from DB by id; GET /blogs/:id', async () => {
    const createdBlog = await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const blog = await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.body.id}`)
      .send()
      .expect(HTTP_STATUSES.OK_200);

    expect(blog.body.id).toBe(createdBlog.body.id);
  });

  it('Should not return unexisting blog from DB by id; GET /blogs/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);
    await request(app)
      .get(`${BLOGS_PATH}/${777}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should create correct blog; POST /blogs', async () => {
    const blogsResponse = await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);
    expect(blogsResponse.body.id).toBe('1');
  });

  it('Should update correct blog from DB by id; PUT /blogs/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const blogsResponse = await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app).put(`${BLOGS_PATH}/${blogsResponse.body.id}`).send({
      name: 'React',
      description: 'React for Dummies',
      webSiteUrl: 'https://learnjavascriptfordummies.ru',
    });

    expect(db.blogs[1].name).toBe('React');
  });

  it('Should not update blog with unexisting id; PUT /blogs/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);
    await request(app)
      .put(`${BLOGS_PATH}/${777}`)
      .send({
        name: 'React',
        description: 'React for Dummies',
        webSiteUrl: 'https://learnjavascriptfordummies.ru',
      })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should not update blog with incorrect dataset; PUT /blogs/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);
    const blogResponse = await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .put(`${BLOGS_PATH}/${blogResponse.body.id}`)
      .send({
        name: 'Reactdasdadasdasfasfasdfasdf',
        description: 'React for Dummies',
        webSiteUrl: 'httpsiptfordummies.ru',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('Should delete blog from DB by id; DELETE /blogs/{id}', async () => {
    const blogResponse = await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);
    await request(app)
      .delete(`${BLOGS_PATH}/${blogResponse.body.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    expect(db.blogs.length).toBe(0);
  });

  it('Should not delete unexisting blog from DB by id; DELETE /blogs/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);
    await request(app)
      .delete(`${BLOGS_PATH}/${777}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Testing Authorization', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .auth('admin', 'qwerty')
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const blogsResponse = await request(app)
      .get(`${BLOGS_PATH}`)
      .expect(HTTP_STATUSES.OK_200);
    expect(blogsResponse.body).toHaveLength(1);
  });
});
