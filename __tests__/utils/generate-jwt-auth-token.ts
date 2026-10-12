import request from 'supertest';
import { AUTH_PATH, AUTH_ROUTES } from '../../src/auth/constants/auth-paths';
import { HTTP_STATUSES } from '../../src/core/types/http-statuses';
import { Express } from 'express';

export const generateJwtAuthToken = async (
  app: Express,
  loginOrEmail: string = 'Leopold',
  password: string = '1234567',
) => {
  const response = await request(app)
    .post(`${AUTH_PATH}${AUTH_ROUTES.LOGIN}`)
    .send({ loginOrEmail: loginOrEmail, password: password })
    .expect(HTTP_STATUSES.OK_200);

  return response.body.accessToken as string;
};
