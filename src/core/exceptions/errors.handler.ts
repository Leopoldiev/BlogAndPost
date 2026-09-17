import { NotFoundException } from './not-found.exception';
import { HTTP_STATUSES } from '../types/http-statuses';
import { Response } from 'express';
export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof NotFoundException) {
    res.status(HTTP_STATUSES.NOT_FOUND_404).send(error.message);
    return;
  }

  // Непредвиденная ошибка — 500 (обязательно завершаем ответ, иначе запрос повиснет).
  res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).send();
}
