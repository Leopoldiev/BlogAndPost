import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { getAllCollections } from '../../../db/collections';

export const clearDbHandler = async (_req: Request, res: Response) => {
  // Полностью очищаем все коллекции (используется в тестах).
  await Promise.all(
    getAllCollections().map((collection) => collection.deleteMany()),
  );

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
