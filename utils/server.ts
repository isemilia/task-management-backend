import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import router from './endpoints'

if(process.env.DATABASE_URI === undefined){
  throw Error('env DATABASE_URI is undefined')
}
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

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(router);

app.listen(4000, () => {
  console.log('Server is running at port 4000');
});
