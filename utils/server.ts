import express from 'express'
import router from './endpoints'

const app = express();

app.use(express.json());

app.use(router)

app.listen(4000, () => {
  console.log('Server is running at port 4000');
});
