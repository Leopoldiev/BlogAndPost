import { body } from 'express-validator';

const loginPattern = '^[a-zA-Z0-9_-]*$';
const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';

const loginValidation = body('login')
  .isString()
  .trim()
  .withMessage('login must be a string')
  .isLength({ min: 3, max: 10 })
  .withMessage('Length of login is incorrect')
  .matches(loginPattern);

const passwordValidation = body('password')
  .isString()
  .trim()
  .withMessage('password must be a string')
  .isLength({ min: 6, max: 20 });

const emailValidation = body('email')
  .isString()
  .trim()
  .withMessage('email must be a string')
  .matches(emailPattern);

export const userInputDtoValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];
