import dotenv from 'dotenv';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { UserCreateDto } from '../../../src/users/application/dtos/user-create.dto';
import { getUserInputDto } from '../../utils/users/get-user-input-dto';
import { USERS_PATH } from '../../../src/users/constants/users-paths';

dotenv.config();

describe('Users API', () => {
  const app = express();
  setupApp(app);

  const correctTestUserInputData: UserCreateDto = getUserInputDto();

  beforeAll(async () => {
    await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should not create new user when incorrect body passed; POST /users', async () => {
    await request(app)
      .post(USERS_PATH)
      .send(correctTestUserInputData)
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);

    const invalidDataSet = await request(app)
      .post(USERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        login: ' ', // empty string
        password: ' ', // empty string
        email: ' ', // empty string
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet.body.errorsMessages).toHaveLength(3);
  });
});
