import { RequestHandler, Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list-handler';
import { getBlogHandler } from './handlers/get-blog-handler';
import { BLOGS_ROUTES } from '../constants/blogs-paths';
import { createBlogHandler } from './handlers/create-blog-handler';
import { updateBlogHandler } from './handlers/update-blog-handler';
import { deleteBlogHandler } from './handlers/delete-blog-handler';
import { idValidation } from '../../core/middlewares/validation/params-id-validation-middleware';
import { blogInputDtoValidation } from '../validation/blog-input-dto-validation-middleware';
import { validationResultMiddleware } from '../../core/middlewares/validation/validation-result-middleware';
import { protectedRouteMiddleware } from '../../auth/middlewares/protected-route-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { BlogSortFields } from './input/blog-sort-fields';
import { sanitizeQueryParams } from '../../core/middlewares/validation/sanitize-query.middleware';
import { PostSortFields } from '../../posts/input/post-sort-fields';
import { getPostListForBlogHandler } from '../../posts/routes/handlers/get-post-list-for-blog-handler';
import { postInputBlogIdValidation } from '../../posts/validation/post-input-dto-validation-middleware';
import { createPostByBlogId } from '../../posts/routes/handlers/create-post-by-blog-id-handler';

export const blogsRouter = Router({});

blogsRouter.get(
  BLOGS_ROUTES.ROOT,
  paginationAndSortingValidation(BlogSortFields),
  validationResultMiddleware,
  sanitizeQueryParams,
  getBlogListHandler as unknown as RequestHandler,
);

blogsRouter.get(
  BLOGS_ROUTES.BY_ID,
  idValidation,
  validationResultMiddleware,
  getBlogHandler,
);

blogsRouter.get(
  `${BLOGS_ROUTES.BY_ID}/posts`,
  paginationAndSortingValidation(PostSortFields),
  validationResultMiddleware,
  sanitizeQueryParams,
  getPostListForBlogHandler as unknown as RequestHandler,
);

blogsRouter.post(
  BLOGS_ROUTES.ROOT,
  protectedRouteMiddleware,
  blogInputDtoValidation,
  validationResultMiddleware,
  createBlogHandler,
);

blogsRouter.post(
  `${BLOGS_ROUTES.BY_ID}/posts`,
  protectedRouteMiddleware,
  postInputBlogIdValidation,
  validationResultMiddleware,
  createPostByBlogId,
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
