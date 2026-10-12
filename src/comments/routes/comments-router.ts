import { RequestHandler, Router } from 'express';
import { COMMENTS_ROUTES } from '../constants/comments-paths';
import { idValidation } from '../../core/middlewares/validation/params-id-validation-middleware';
import { validationResultMiddleware } from '../../core/middlewares/validation/validation-result-middleware';
import { getCommentHandler } from './handlers/get-comment-handler';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access-token-guard-middleware';
import { commentInputDtoValidation } from '../validation/comment-input-dto-validation-middleware';
import { updateCommentHandler } from './handlers/update-comment-handler';
import { deleteCommentHandler } from './handlers/delete-comment-handler';

export const commentsRouter = Router({});

commentsRouter.get(
  COMMENTS_ROUTES.BY_ID,
  idValidation,
  validationResultMiddleware,
  getCommentHandler,
);

commentsRouter.put(
  COMMENTS_ROUTES.BY_ID,
  accessTokenGuardMiddleware,
  idValidation,
  commentInputDtoValidation,
  validationResultMiddleware,
  updateCommentHandler as unknown as RequestHandler,
);

commentsRouter.delete(
  COMMENTS_ROUTES.BY_ID,
  accessTokenGuardMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteCommentHandler as unknown as RequestHandler,
);
