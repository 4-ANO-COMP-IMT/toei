import express from 'express';
import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';
import { config } from './config/config';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:30011',
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
  
app.use(session({
  store: MongoStore.create({
    mongoUrl: config.mongoUri,
    collectionName: 'sessions',
    stringify: false
  }),
  secret: config.sessionSecret as string ,
  resave: true,
  saveUninitialized: false,
  rolling: true,
  unset: 'destroy',
  name: 'session',
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    partitioned: false,
    priority: 'medium',
    domain: 'localhost',
  }
}))

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`User Microservice is running on port ${PORT}`);
});

app.use('/user', userRoutes);
