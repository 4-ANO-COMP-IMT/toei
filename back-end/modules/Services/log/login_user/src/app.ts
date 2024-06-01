import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { config } from './config/config';
import authRoutes from './routes/authRoutes';

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

app.use('/auth', authRoutes);

import axios from 'axios';

export const getEventBridgeData = async () => {
  try {
    const user = await axios.get('http://localhost:4000/event');

    const User = user.data;

    return User;
  } catch (error) {
    console.error(`Erro ao obter dados do Event Bridge: ${error}`);
  }
};

getEventBridgeData();

app.get('/', (req, res) => {
  res.send('Create Auth Microservice');
});