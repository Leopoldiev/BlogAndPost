import { body } from 'express-validator';

const loginPattern = '^[a-zA-Z0-9_-]*$';
const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';

export const loginValidation = body('login')
  .isString()
  .withMessage('Login must be a string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('login length is not correct')
  .matches(loginPattern)
  .withMessage(
    'Login can contain only letters, numbers, underscores and hyphens',
  );

export const passwordValidation = body('password')
  .isString()
  .withMessage('Password must be a string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('password length is not correct');

export const emailValidation = body('email')
  .isString()
  .withMessage('Email must be a string')
  .trim()
  .matches(emailPattern)
  .withMessage('Email must be like example@example.dev');

export const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('loginOrEmail is not correct');

export const codeValidation = body('code')
  .isString()
  .trim()
  .withMessage('Code must be a string');

export const userLoginInputDtoValidation = [
  loginOrEmailValidation,
  passwordValidation,
];

export const userRegistrationInputDtoValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];

