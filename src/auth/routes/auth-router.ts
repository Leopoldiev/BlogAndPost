import { RequestHandler, Router } from 'express';
import { AUTH_ROUTES } from '../constants/auth-paths';
import { userCredentialsInputDtoValidation } from '../validation/user-credentials-input-dto-validation-middleware';
import { validationResultMiddleware } from '../../core/middlewares/validation/validation-result-middleware';
import { loginUserHandler } from './handlers/login-user-handler';

export const authRouter = Router();

authRouter.post(
  AUTH_ROUTES.LOGIN,
  userCredentialsInputDtoValidation,
  validationResultMiddleware,
  loginUserHandler as unknown as RequestHandler,
);
