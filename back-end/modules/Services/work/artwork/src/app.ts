import express from 'express';
import artworkRoutes from './routes/artworkRoutes';
import mongoose from 'mongoose';
import { config } from './config/config';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const cors = require('cors');
const app = express();
const RedisClient = createClient({
  password: config.redisPassword,
  socket: {
      host: config.redisHost,
      port: Number(config.redisPort)
  }
});

RedisClient.connect().then(()=>{
  console.log('Connected to Redis');
}).catch(console.error);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(cookieParser());
app.use(session({
  store: new RedisStore({ client: RedisClient }),
  secret: config.sessionSecret as string ,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: config.sessionMaxAge
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

app.use('/artwork', artworkRoutes);
