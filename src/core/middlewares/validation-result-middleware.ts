import { ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../types/http-statuses';
import { FieldError } from '../types/field-error';

// Приводит ошибку express-validator к нашему формату { field, message }.
// У ошибок типа 'field' (body/param — а других валидаторов у нас нет) есть путь к полю.
const formatErrors = (error: ValidationError): FieldError => {
  if (error.type === 'field') {
    return { field: error.path, message: error.msg };
  }

  // Прочие типы ошибок express-validator у нас не используются.
  return { field: '', message: error.msg };
};

// Собирает результат всех валидаторов запроса. Если есть ошибки — отвечает 400,
// иначе передаёт управление дальше (в handler).
export const validationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: errors });
    return;
  }

  next();
};
