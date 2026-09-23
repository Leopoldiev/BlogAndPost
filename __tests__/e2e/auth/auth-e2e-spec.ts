import dotenv from 'dotenv';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import { createUser } from '../../utils/users/create-user';
import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { AUTH_PATH, AUTH_ROUTES } from '../../../src/auth/constants/auth-paths';

dotenv.config();

describe('Auth API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('Should auth user with correct credentials in MongoDB; POST /auth/login', async () => {
    await createUser(app);

    await request(app)
      .post(`${AUTH_PATH}${AUTH_ROUTES.LOGIN}`)
      .send({ loginOrEmail: 'Leopold', password: '1234567' })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });
});
