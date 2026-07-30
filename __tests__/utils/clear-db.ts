import request from 'supertest';
import { Express } from 'express';
import { HTTP_STATUSES } from '../../src/core/types/http-statuses';
import { TESTING_PATH } from '../../src/testing/constants/testing-paths';

export const clearDB = async (app: Express) => {
  await request(app)
    .delete(`${TESTING_PATH}/all-data`)
    .expect(HTTP_STATUSES.NO_CONTENT_204);
};
