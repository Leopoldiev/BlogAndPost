import dotenv from 'dotenv';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import request from 'supertest';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { ObjectId } from 'mongodb';
import { createUser } from '../../utils/users/create-user';
import { USERS_PATH } from '../../../src/users/constants/users-paths';
import { UserCreateDto } from '../../../src/users/application/dtos/user-create.dto';
import { getUserInputDto } from '../../utils/users/get-user-input-dto';

dotenv.config();

describe('Users API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should create correct user in MongoDB; POST /users', async () => {
    await createUser(app);

    const response = await request(app)
      .get(USERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('Should not create user with the similar login or email in MongoDB; POST /users', async () => {
    await createUser(app);

    const defaultUserData: UserCreateDto = getUserInputDto();

    const testUserData = { ...defaultUserData };

    await request(app)
      .post(`${USERS_PATH}`)
      .set('Authorization', generateBasicAuthToken())
      .send(testUserData)
      .expect(HTTP_STATUSES.CONFLICT_409);
  });

  it('Should return all users from MongoDB; GET /users', async () => {
    await createUser(app);
    await createUser(app, {
      login: 'test',
      password: '1234567',
      email: 'test@mail.ru',
    });

    const response = await request(app)
      .get(USERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it('Should delete user from MongoDB by id; DELETE /users/{id}', async () => {
    const createdUser = await createUser(app);

    await request(app)
      .delete(`${USERS_PATH}/${createdUser.id}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${USERS_PATH}/${createdUser.id}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should not delete unexisting user from DB by id; DELETE /users/{id}', async () => {
    const nonExistingId = new ObjectId().toString();

    await request(app)
      .delete(`${USERS_PATH}/${nonExistingId}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
