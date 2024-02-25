import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import router from './endpoints'

if(process.env.MONGODB_URI === undefined){
  throw Error('env MONGODB_URI is undefined')
}
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log(err);
  })

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// app.use((req, res, next) => {
//   console.log(req.cookies)
//   next();
// })

app.use(router);


app.listen(4000, () => {
  console.log('Server is running at port 4000');
});
