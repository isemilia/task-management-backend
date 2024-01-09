import './utils/extends/request'
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { validationResult } from 'express-validator';
import { signupValidation } from './validations/auth.js';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

dotenv.config();

if(process.env.DATABASE_URI === undefined || process.env.JWT_SECRET === undefined){
  throw Error("DATABASE_URI")
}

const DATABASE_URI = process.env.DATABASE_URI
const JWT_SECRET = process.env.JWT_SECRET

mongoose
  .connect(DATABASE_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log(err);
  })

const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World');
})

app.post('/auth/login', async (req: express.Request, res: express.Response) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username }).then(result => result);

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        info: {
          message: 'User does not exist',
          details: null
        }
      })
    }

    const isValidPw = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPw) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        info: {
          message: 'Invalid password',
          details: null
        }
      })
    }

    // if username and password are valid
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password, ...restUser } = user;

    res.json({
      isSuccess: true,
      data: {
        user: restUser,
        token
      },
      info: {}
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      isSuccess: false,
      data: {},
      info: {
        message: 'Failed to log in',
        details: null
      }
    });
  }
});

app.post('/auth/signup', signupValidation, async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        info: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      avatar: req.body.avatar,
    });

    await user.save()
      .then((savedUser) => {
        const token = jwt.sign(
          { _id: savedUser._id },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        const { password, ...restUser } = savedUser;

        res.json({
          isSuccess: true,
          data: {
            user: restUser,
            token
          },
          info: {}
        });
      })
  } catch (err) {
    console.log(err);

    res.status(500).json({
      isSuccess: false,
      data: {},
      info: {
        message: 'Failed to create user',
        details: null
      }
    });
  }
});

app.get('/auth/me', checkAuth, async (req: express.Request, res: express.Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        info: {
          message: 'User not found',
          details: null
        }
      });
    }

    res.json({
      isSuccess: true,
      data: {
        user
      },
      info: {}
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      isSuccess: false,
      data: {},
      info: {
        message: 'Failed to get me',
        details: null
      }
    });
  }
});

app.listen(4000, () => {
  console.log('Server is running');
});
