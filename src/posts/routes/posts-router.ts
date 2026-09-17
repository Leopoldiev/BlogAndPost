import { RequestHandler, Router } from 'express';
import { POSTS_ROUTES } from '../constants/posts-paths';
import { getPostListHandler } from './handlers/get-post-list-handler';
import { getPostHandler } from './handlers/get-post-handler';
import { createPostHandler } from './handlers/create-post-handler';
import { updatePostHandler } from './handlers/update-post-handler';
import { deletePostHandler } from './handlers/delete-post-handler';
import { idValidation } from '../../core/middlewares/validation/params-id-validation-middleware';
import { validationResultMiddleware } from '../../core/middlewares/validation/validation-result-middleware';
import { postInputDtoValidation } from '../validation/post-input-dto-validation-middleware';
import { protectedRouteMiddleware } from '../../auth/middlewares/protected-route-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { sanitizeQueryParams } from '../../core/middlewares/validation/sanitize-query.middleware';
import { PostSortFields } from '../input/post-sort-fields';

export const postsRouter = Router({});

postsRouter.get(
  POSTS_ROUTES.ROOT,
  paginationAndSortingValidation(PostSortFields),
  validationResultMiddleware,
  sanitizeQueryParams,
  getPostListHandler as unknown as RequestHandler,
);

postsRouter.get(
  POSTS_ROUTES.BY_ID,
  idValidation,
  validationResultMiddleware,
  getPostHandler,
);

postsRouter.post(
  POSTS_ROUTES.ROOT,
  protectedRouteMiddleware,
  postInputDtoValidation,
  validationResultMiddleware,
  createPostHandler,
);

postsRouter.put(
  POSTS_ROUTES.BY_ID,
  protectedRouteMiddleware,
  idValidation,
  postInputDtoValidation,
  validationResultMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  POSTS_ROUTES.BY_ID,
  protectedRouteMiddleware,
  idValidation,
  validationResultMiddleware,
  deletePostHandler,
);
