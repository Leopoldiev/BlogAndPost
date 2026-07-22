import { Request, Response } from 'express';
import { db } from '../../../db/in-memory-db';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';

export const clearDbHandler = (_req: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
