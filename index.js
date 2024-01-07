import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log(err);
  })

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/auth/signup', (req, res) => {
  console.log(req.body);

  res.json({
    isSuccess: true,
    data: {}
  });
});

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Server is running');
});