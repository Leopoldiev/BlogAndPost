import { RequestHandler, Router } from 'express';
import { USERS_ROUTES } from '../constants/users-paths';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { UserSortFields } from './input/user-sort-fields';
import { validationResultMiddleware } from '../../core/middlewares/validation/validation-result-middleware';
import { sanitizeQueryParams } from '../../core/middlewares/validation/sanitize-query.middleware';
import { getUserListHandler } from './handlers/get-user-list-handler';
import { protectedRouteMiddleware } from '../../auth/middlewares/protected-route-middleware';
import { userInputDtoValidation } from '../validation/user-input-dto-validation-middleware';
import { createUserHandler } from './handlers/create-user-handler';
import { idValidation } from '../../core/middlewares/validation/params-id-validation-middleware';
import { deleteUserHandler } from './handlers/delete-user-handler';

export const usersRouter = Router();

usersRouter.get(
  USERS_ROUTES.ROOT,
  protectedRouteMiddleware,
  paginationAndSortingValidation(UserSortFields),
  validationResultMiddleware,
  sanitizeQueryParams,
  getUserListHandler as unknown as RequestHandler,
);

usersRouter.post(
  USERS_ROUTES.ROOT,
  protectedRouteMiddleware,
  userInputDtoValidation,
  validationResultMiddleware,
  createUserHandler,
);

usersRouter.delete(
  USERS_ROUTES.BY_ID,
  protectedRouteMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteUserHandler,
);
