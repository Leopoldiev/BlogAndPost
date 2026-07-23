import { body } from 'express-validator';

const urlPattern =
  '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$';

const nameValidation = body('name')
  .isString()
  .trim()
  .withMessage('Name must be a string')
  .isLength({ min: 1, max: 15 })
  .withMessage('Length of name is incorrect');

const descriptionValidation = body('description')
  .isString()
  .trim()
  .withMessage('Description must be a string')
  .isLength({ min: 1, max: 500 })
  .withMessage('Length of description is incorrect');

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .trim()
  .withMessage('websiteUrl must be a string')
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of websiteUrl is incorrect')
  .matches(urlPattern);

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
