import { setupApp } from '../../../src/setup-app';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { POSTS_PATH } from '../../../src/posts/constants/posts-paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import { createPost } from '../../utils/posts/create-post';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { appConfig } from '../../../src/core/config/config';
import { COMMENTS_PATH } from '../../../src/comments/constants/comments-paths';
import { createBlog } from '../../utils/blogs/create-blog';
import { generateJwtAuthToken } from '../../utils/generate-jwt-auth-token';
import { createComment } from '../../utils/comments/create-comment';
import { createUser } from '../../utils/users/create-user';

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

  it('Should create correct comment inside post in MongoDB; POST /posts{postId}/comments', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    const token = await generateJwtAuthToken(app);

    const response = await createComment(app, createdPost.id.toString(), token);

    expect(response.content).toBe('That was a good saturday day in London');
  });
  it('Should not create comment inside post with incorrect postId in MongoDB; POST /posts{postId}/comments', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    const token = await generateJwtAuthToken(app);

    const nonExistentPostId = new ObjectId().toString();

    const response = await request(app)
      .post(`${POSTS_PATH}/${nonExistentPostId}${COMMENTS_PATH}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ content: 'That was a good saturday day in London' })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should return all comments for specified post MongoDB; GET /posts{postId}/comments', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    const token = await generateJwtAuthToken(app);

    await createComment(app, createdPost.id.toString(), token);
    await createComment(app, createdPost.id.toString(), token);

    const response = await request(app)
      .get(`${POSTS_PATH}/${createdPost.id.toString()}${COMMENTS_PATH}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it('Should return comment by id MongoDB; GET /comments/{id}', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    const token = await generateJwtAuthToken(app);

    const comment = await createComment(app, createdPost.id.toString(), token);

    const response = await request(app)
      .get(`${COMMENTS_PATH}/${comment.id}`)
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body.content).toBe(
      'That was a good saturday day in London',
    );
  });

  it('Should update comment by id MongoDB; PUT /comments/{id}', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    const token = await generateJwtAuthToken(app);

    const comment = await createComment(app, createdPost.id.toString(), token);

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ content: 'That was a good sunday day in London' })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it('Should not update comment by id with another userId MongoDB; PUT /comments/{id}', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    await createUser(app, {
      login: 'Leopoldiev',
      password: '12345678',
      email: 'lightmb@mail.ru',
    });
    const token = await generateJwtAuthToken(app);
    const token2 = await generateJwtAuthToken(app, 'Leopoldiev', '12345678');

    const comment = await createComment(app, createdPost.id.toString(), token);

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}`)
      .set({ Authorization: `Bearer ${token2}` })
      .send({ content: 'That was a good sunday day in London' })
      .expect(HTTP_STATUSES.FORBIDDEN_403);
  });

  it('Should delete comment by id MongoDB; DELETE /comments/{id}', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    const token = await generateJwtAuthToken(app);

    const comment = await createComment(app, createdPost.id.toString(), token);

    await request(app)
      .delete(`${COMMENTS_PATH}/${comment.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it('Should not delete comment by id with another userId MongoDB; DELETE /comments/{id}', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);
    await createUser(app, {
      login: 'Leopoldiev',
      password: '12345678',
      email: 'lightmb@mail.ru',
    });
    const token = await generateJwtAuthToken(app);
    const token2 = await generateJwtAuthToken(app, 'Leopoldiev', '12345678');

    const comment = await createComment(app, createdPost.id.toString(), token);

    await request(app)
      .delete(`${COMMENTS_PATH}/${comment.id}`)
      .set({ Authorization: `Bearer ${token2}` })
      .expect(HTTP_STATUSES.FORBIDDEN_403);
  });

  it('Should not delete comment by id with unexisting commentId MongoDB; DELETE /comments/{id}', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog.id);
    await createUser(app);

    const token = await generateJwtAuthToken(app);
    const nonExistentCommentId = new ObjectId().toString();

    const comment = await createComment(app, createdPost.id.toString(), token);

    await request(app)
      .delete(`${COMMENTS_PATH}/${nonExistentCommentId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
