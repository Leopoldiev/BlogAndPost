import { Router } from 'express';
import { POSTS_ROUTES } from '../constants/posts-paths';
import { getPostListHandler } from './handlers/get-post-list-handler';
import { getPostHandler } from './handlers/get-post-handler';
import { createPostHandler } from './handlers/create-post-handler';
import { updatePostHandler } from './handlers/update-post-handler';
import { deletePostHandler } from './handlers/delete-post-handler';
import { idValidation } from '../../core/middlewares/params-id-validation-middleware';
import { validationResultMiddleware } from '../../core/middlewares/validation-result-middleware';
import { postInputDtoValidation } from '../validation/post-input-dto-validation-middleware';
import { protectedRouteMiddleware } from '../../auth/middlewares/protected-route-middleware';

export const postsRouter = Router({});

postsRouter.get(POSTS_ROUTES.ROOT, getPostListHandler);

postsRouter.get(
  POSTS_ROUTES.BY_ID,
  idValidation,
  validationResultMiddleware,
  getPostHandler,
);

postsRouter.post(
  POSTS_ROUTES.ROOT,
  protectedRouteMiddleware,
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
