import { setupApp } from '../../../src/setup-app';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { PostInputDto } from '../../../src/posts/dto/post-input-dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import { createPost } from '../../utils/posts/create-post';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { ObjectId } from 'mongodb';
import { updatePost } from '../../utils/posts/update-post';

describe('Posts API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should create correct post in MongoDB; POST /posts', async () => {
    await createPost(app);
  });

  it('Should return all posts from MongoDB; GET /posts', async () => {
    await createPost(app);
    await createPost(app);

    const response = await request(app)
      .get(POSTS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('Should return existing post from MongoDB by id; GET /posts/:id', async () => {
    const createdPost = await createPost(app);

    const post = await getPostById(app, createdPost.id);

    expect(post).toEqual({
      ...createdPost,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('Should not return post with unexisting from MongoDB by id; GET /posts/{id}', async () => {
    await createPost(app);

    const nonExistingId = new ObjectId().toString();

    await request(app)
      .get(`${POSTS_PATH}/${nonExistingId}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should update correct post in MongoDB by id; PUT /posts/{id}', async () => {
    const createdPost = await createPost(app);

    const postUpdateData: PostInputDto = {
      title: 'New title',
      shortDescription: 'New description',
      content: 'New content',
      blogId: createdPost.blogId,
    };

    await updatePost(app, createdPost.id, postUpdateData);

    const post = await getPostById(app, createdPost.id);
    console.log(post);
    expect(post).toEqual({
      id: expect.any(String),
      title: postUpdateData.title,
      shortDescription: postUpdateData.shortDescription,
      content: postUpdateData.content,
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('Should not update post with unexisting id; PUT /posts/{id}', async () => {
    const createdPost = await createPost(app);

    const postUpdateData: PostInputDto = {
      title: 'New title',
      shortDescription: 'New description',
      content: 'New content',
      blogId: createdPost.blogId,
    };

    const nonExistingId = new ObjectId().toString();

    await request(app)
      .put(`${POSTS_PATH}/${nonExistingId}`)
      .set('Authorization', generateBasicAuthToken())
      .send(postUpdateData)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should delete post from MongoDB by id; DELETE /posts/{id}', async () => {
    const createdPost = await createPost(app);

    await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should not delete unexisting post from DB by id; DELETE /posts/{id}', async () => {
    const nonExistingId = new ObjectId().toString();

    await request(app)
      .delete(`${POSTS_PATH}/${nonExistingId}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
