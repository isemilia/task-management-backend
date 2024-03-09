import mongoose from 'mongoose'

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
