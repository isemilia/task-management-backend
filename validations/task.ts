import { body } from "express-validator";

export const createTaskValidation = [
  body('title').isLength({ min: 2 }),
  body('description').isString().optional(),
  body('date').isString(),
  body('labels').optional().isArray(),
];