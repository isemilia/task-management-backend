import express, { Request, Response } from 'express'

import {loginValidation, signupValidation} from '../validations/auth'
import checkAuth from '../utils/checkAuth'
import UserController from '../controllers/UserController';
import TaskController, {getAllByCurrentUser} from '../controllers/TaskController'
import {createTaskValidation} from '../validations/task';

const router = express.Router()

router.get('/', async (_req: Request, res: Response) => {
  res.send('Hello World')
});

// user routs
router.post('/auth/login', loginValidation, UserController.login);

router.post('/auth/signup', signupValidation, UserController.signup);

router.get('/auth/me', checkAuth, UserController.getMe);

// task routes
router.post('/tasks', checkAuth, ...createTaskValidation, TaskController.create);
router.get('/tasks', checkAuth, TaskController.getAllByCurrentUser);
router.get('/tasks/:id', checkAuth, TaskController.getOne);
// router.delete('/tasks', checkAuth, TaskController.delete);

export default router
