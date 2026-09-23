import { NotFoundException } from './not-found.exception';
import { HTTP_STATUSES } from '../types/http-statuses';
import { Response } from 'express';
import { LoginOrEmailAlreadyExistException } from './login-or-email-already-exist.exception';
import { UserCredentialsIsWrong } from './user-credentials-is-wrong';
export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof NotFoundException) {
    res.status(HTTP_STATUSES.NOT_FOUND_404).send(error.message);
    return;
  }

  if (error instanceof UserCredentialsIsWrong) {
    res.status(HTTP_STATUSES.UNAUTHORIZED_401).send();
    return;
  }

  if (error instanceof LoginOrEmailAlreadyExistException) {
    res.status(HTTP_STATUSES.CONFLICT_409).send({
      errorsMessages: [{ message: error.message, field: 'login or email' }],
    });
  }

  // Непредвиденная ошибка — 500 (обязательно завершаем ответ, иначе запрос повиснет).
  res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).send();
}
