import './env'
import './utils/extends/request'
import './utils/server'

// your old changes!
//
//import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
//
// import { signupValidation } from './validations/auth.js';
// import checkAuth from './utils/checkAuth.js';
// import UserController from './controllers/UserController.js';
//
// dotenv.config();
//
// mongoose
//   .connect(process.env.DATABASE_URI)
//   .then(() => {
//     console.log('Connected to database');
//   })
//   .catch((err) => {
//     console.log(err);
//   })
//
// const app = express();
//
// app.use(express.json());
//
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });
//
// app.post('/auth/login', UserController.login);
//
// app.post('/auth/signup', signupValidation, UserController.signup);
//
// app.get('/auth/me', checkAuth, UserController.getMe);
//
// app.listen(4000, (err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//
//   console.log('Server is running');
// });
