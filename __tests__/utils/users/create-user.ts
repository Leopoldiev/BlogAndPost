import { Express } from 'express';
import request from 'supertest';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUSES } from '../../../src/core/types/http-statuses';
import { UserCreateDto } from '../../../src/users/application/dtos/user-create.dto';
import { USERS_PATH } from '../../../src/users/constants/users-paths';
import { UserViewModel } from '../../../src/users/routes/output/user.view-model';
import { getUserInputDto } from './get-user-input-dto';

export const createUser = async (
  app: Express,
  userDto?: UserCreateDto,
): Promise<UserViewModel> => {
  const defaultUserData: UserCreateDto = getUserInputDto();

  const testUserData = { ...defaultUserData, ...userDto };

  const createUserResponse = await request(app)
    .post(`${USERS_PATH}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testUserData)
    .expect(HTTP_STATUSES.CREATED_201);

  expect(createUserResponse.body).toBeDefined();

  return createUserResponse.body;
};
