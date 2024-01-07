import { body } from "express-validator";

export const signupValidation = [
  body('name').isLength({ min: 2 }),
  body('username').isLength({ min: 6 }),
  body('password').isLength({ min: 6 }),
  body('avatar').optional().isURL(),
];