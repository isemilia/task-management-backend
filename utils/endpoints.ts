import express, { Request, Response } from 'express'
import UserController from '../controllers/UserController';

import { signupValidation } from '../validations/auth'
import checkAuth from '../utils/checkAuth'

const router = express.Router()

router.get('/', async (_req: Request, res: Response) => {
  res.send('Hello World')
});

router.post('/auth/login', UserController.login);

router.post('/auth/signup', signupValidation, UserController.signup);

router.get('/auth/me', checkAuth, UserController.getMe);

export default router
