import express from 'express';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';
import { config } from './config/config';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const cors = require('cors');
const app = express();

var whitelist = [config.reactUrl, config.flutterUrl];
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
    maxAge: config.sessionMaxAge,
    partitioned: false,
    priority: 'medium',
    domain: 'localhost',
  }
}))

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Login Microservice is running on port ${PORT}`);
});

app.use('/auth', authRoutes);
