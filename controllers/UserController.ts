import express, {Request, Response} from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User';

if(process.env.DATABASE_URI === undefined || process.env.JWT_SECRET === undefined){
  throw Error("DATABASE_URI")
}

const DATABASE_URI = process.env.DATABASE_URI
const JWT_SECRET = process.env.JWT_SECRET

const signup = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
                result: {},
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
      // avatar: req.body.avatar,
    });

    await user.save()
      .then((savedUser) => {
        const token = jwt.sign(
          { _id: savedUser._id },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        const savedDoc = savedUser.toObject()
        const { password, ...restUser } = savedDoc;

        res.json({
          result: {
            user: restUser,
            token
          },
          info: {}
        });
      })
  } catch (err) {
    console.log(err);

    res.status(500).json({
            result: {},
      info: {
        message: 'Failed to create user',
        details: null
      }
    });
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel
      .findOne({ username: req.body.username })
      .then(result => result);

    if (!user) {
      return res.status(404).json({
        result: {},
        info: {
          message: 'User does not exist',
          details: null
        }
      })
    }

    const isValidPw = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPw) {
      return res.status(400).json({
        result: {},
        info: {
          message: 'Invalid password',
          details: null
        }
      })
    }

    // if username and password are valid
    const userDoc = user.toObject();
    const token = jwt.sign(
      { _id: userDoc._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password, ...restUser } = userDoc;

    res.json({
      result: {
        user: restUser,
        token
      },
      info: {}
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      result: {},
      info: {
        message: 'Failed to log in',
        details: null
      }
    });
  }
}

const getMe =  async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        result: {},
        info: {
          message: 'User not found',
          details: null
        }
      });
    }

    res.json({
      result: {
        user: user
      },
      info: {}
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      result: {},
      info: {
        message: 'Failed to get me',
        details: null
      }
    });
  }
}

export default { signup, login, getMe }
