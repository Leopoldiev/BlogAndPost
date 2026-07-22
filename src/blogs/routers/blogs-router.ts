import { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list-handler';
import { getBlogHandler } from './handlers/get-blog-handler';
import { BLOGS_ROUTES } from '../constants/blogs-paths';
import { createBlogHandler } from './handlers/create-blog-handler';
import { updateBlogHandler } from './handlers/update-blog-handler';
import { deleteBlogHandler } from './handlers/delete-blog-handler';
import { idValidation } from '../../core/middlewares/params-id-validation-middleware';
import { blogInputDtoValidation } from '../validation/blog-input-dto-validation-middleware';
import { validationResultMiddleware } from '../../core/middlewares/validation-result-middleware';
import { protectedRouteMiddleware } from '../../auth/middlewares/protected-route-middleware';

export const blogsRouter = Router({});

blogsRouter.get(BLOGS_ROUTES.ROOT, getBlogListHandler);

blogsRouter.get(
  BLOGS_ROUTES.BY_ID,
  idValidation,
  validationResultMiddleware,
  getBlogHandler,
);

blogsRouter.post(
  BLOGS_ROUTES.ROOT,
  protectedRouteMiddleware,
  blogInputDtoValidation,
  validationResultMiddleware,
  createBlogHandler,
);

blogsRouter.put(
  BLOGS_ROUTES.BY_ID,
  protectedRouteMiddleware,
  idValidation,
  blogInputDtoValidation,
  validationResultMiddleware,
  updateBlogHandler,
);

blogsRouter.delete(
  BLOGS_ROUTES.BY_ID,
  protectedRouteMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteBlogHandler,
);
