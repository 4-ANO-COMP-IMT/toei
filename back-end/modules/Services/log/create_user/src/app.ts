import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';
import { config } from './config/config';
import axios from 'axios';
import { createUser } from './service/userService';

const app = express();

if (!config.mongoUri || !config.port) {
  console.error('Required configuration is missing');
  process.exit(1);
}

mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Create User Microservice is running on port ${PORT}`);
});

app.use(bodyParser.json());

app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Create User Microservice');

});




// interface UserRegisteredEvent {
//   name: string
//   password: string
//   birthDate: Date
//   login: string
//   email: string
// }


// app.post('/event', async (req, res) => {
//   const { payload } = req.body;
//   const event = payload as UserRegisteredEvent;
//   console.log(event);
//   await axios.post('http://localhost:10000/event', { payload: event });
//   res.status(200).send();
//   res.end();
// });


