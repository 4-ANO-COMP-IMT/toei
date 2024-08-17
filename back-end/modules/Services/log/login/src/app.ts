import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';
import { config } from './config/config';

import session from 'express-session';
import cookieParser from 'cookie-parser';

const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
  secret: 'secret', // secret deve estar em um arquivo de .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 1 // 1 minute
  }
}))

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

app.use('/auth', authRoutes);
