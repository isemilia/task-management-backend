import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

const signup = async (req, res) => {
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
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );

        const { password, ...restUser } = savedUser._doc;

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
}

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });

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

    const isValidPw = await bcrypt.compare(req.body.password, user._doc.password);

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
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password, ...restUser } = user._doc;

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
}

const getMe = async (req, res) => {
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
}

export default { signup, login, getMe }