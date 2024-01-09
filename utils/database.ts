import mongoose from 'mongoose'

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
