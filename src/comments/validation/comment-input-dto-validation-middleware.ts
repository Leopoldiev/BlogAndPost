import { body } from 'express-validator';

const contentValidation = body('content')
  .isString()
  .withMessage('Content must be a string')
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage('Length of title is incorrect');

export const commentInputDtoValidation = [contentValidation];
