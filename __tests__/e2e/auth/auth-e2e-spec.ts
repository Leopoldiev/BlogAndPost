import dotenv from 'dotenv';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDB } from '../../utils/clear-db';
import { createUser } from '../../utils/users/create-user';
import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { AUTH_PATH, AUTH_ROUTES } from '../../../src/auth/constants/auth-paths';
import { appConfig } from '../../../src/core/config/config';
import { generateJwtAuthToken } from '../../utils/generate-jwt-auth-token';

dotenv.config();

describe('Auth API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(appConfig.MONGO_URL || 'mongodb://localhost:27017');
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
      .expect(HTTP_STATUSES.OK_200);
  });

  it('Should return user information that has valid JWT token; POST /auth/me', async () => {
    const token = await generateJwtAuthToken(app);

    const response = await request(app)
      .get(`${AUTH_PATH}${AUTH_ROUTES.ME}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body.login).toBe('Leopold');
  });
});
