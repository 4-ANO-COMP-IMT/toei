import express from 'express';
import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';
import { config } from './config/config';

const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json());

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

app.use('/user', userRoutes);
