import { setupApp } from '../../../src/setup-app';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { PostInputDto } from '../../../src/posts/dto/post-input-dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-dto';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs-paths';
import { db } from '../../../src/db/in-memory-db';

describe('Posts API', () => {
  const app = express();
  setupApp(app);

  const correctTestBlogData: BlogInputDto = {
    name: 'JavaScript',
    description: 'Computer Science',
    websiteUrl: 'https://learnjavascript.ru',
  };

  const correctTestPostData: PostInputDto = {
    title: 'React',
    shortDescription: 'React samurai way',
    content: 'The best course...',
    blogId: '1',
  };

  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it('Should return all posts from DB; GET /posts', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    const postsResponse = await request(app)
      .get(POSTS_PATH)
      .expect(HTTP_STATUSES.OK_200);
    expect(postsResponse.body.length).toBe(1);
  });

  it('Should return existing post from DB by id; GET /posts/:id', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const createdPost = await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    const post = await request(app)
      .get(`${POSTS_PATH}/${createdPost.body.id}`)
      .send()
      .expect(HTTP_STATUSES.OK_200);

    expect(post.body.id).toBe(createdPost.body.id);
  });

  it('Should not return unexisting post from DB by id; GET /posts/{id}', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .get(`${POSTS_PATH}/${777}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should create correct post; POST /posts', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const postsResponse = await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);
    expect(postsResponse.body.id).toBe('1');
  });

  it('Should update correct post from DB by id; PUT /posts/{id}', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    const postsResponse = await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app).put(`${POSTS_PATH}/${postsResponse.body.id}`).send({
      title: 'React',
      shortDescription: 'React samurai way',
      content: 'The best course...',
      blogId: '1',
    });

    expect(db.posts[1].title).toBe('React');
  });

  it('Should not update post with unexisting id; PUT /posts/{id}', async () => {
    await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);
    await request(app)
      .put(`${POSTS_PATH}/${777}`)
      .send({
        title: 'React',
        shortDescription: 'React samurai way',
        content: 'The best course...',
        blogId: '1',
      })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should not update post with incorrect dataset; PUT /posts/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const postResponse = await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .put(`${POSTS_PATH}/${postResponse.body.id}`)
      .send({
        title: 'Reactfsfsfdsdsfsdfsdfsdfsfdsfdfsdfsdfdsfdsfsdfsdfsdfsffsfsf',
        shortDescription: 'React samurai way',
        content: 'The best course...',
        blogId: '1',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('Should delete post from DB by id; DELETE /posts/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    const postResponse = await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .delete(`${POSTS_PATH}/${postResponse.body.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    expect(db.posts.length).toBe(0);
  });

  it('Should not delete unexisting post from DB by id; DELETE /posts/{id}', async () => {
    await request(app)
      .post(`${BLOGS_PATH}`)
      .send(correctTestBlogData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .post(`${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .delete(`${POSTS_PATH}/${777}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
