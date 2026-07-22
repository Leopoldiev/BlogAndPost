import { Router } from 'express';
import { clearDbHandler } from './handlers/clear-db-handler';

export const testingRouter = Router({});

testingRouter.delete('/all-data', clearDbHandler);
