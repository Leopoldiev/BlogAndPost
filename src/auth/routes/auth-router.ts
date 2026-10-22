import { RequestHandler, Router } from 'express';
import { AUTH_ROUTES } from '../constants/auth-paths';
import {
  codeValidation,
  emailValidation,
  userLoginInputDtoValidation,
  userRegistrationInputDtoValidation,
} from '../validation/user-credentials-input-dto-validation-middleware';
import { validationResultMiddleware } from '../../core/middlewares/validation/validation-result-middleware';
import { loginUserHandler } from './handlers/login-user-handler';
import { accessTokenGuardMiddleware } from '../middlewares/access-token-guard-middleware';
import { meUserHandler } from './handlers/me-user-handler';
import { registrationUserHandler } from './handlers/registration-user-handler';
import { registrationConfirmationUserHandler } from './handlers/registration-confirmation-user-handler';
import { registrationEmailResendingHandler } from './handlers/registration-email-resending-handler';

export const authRouter = Router();

authRouter.post(
  AUTH_ROUTES.LOGIN,
  userLoginInputDtoValidation,
  validationResultMiddleware,
  loginUserHandler as unknown as RequestHandler,
);

authRouter.get(AUTH_ROUTES.ME, accessTokenGuardMiddleware, meUserHandler);

authRouter.post(
  AUTH_ROUTES.REGISTRATION,
  userRegistrationInputDtoValidation,
  validationResultMiddleware,
  registrationUserHandler,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION_CONFIRMATION,
  codeValidation,
  validationResultMiddleware,
  registrationConfirmationUserHandler,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION_EMAIL_RESENDING,
  emailValidation,
  validationResultMiddleware,
  registrationEmailResendingHandler,
);
