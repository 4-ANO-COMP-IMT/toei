import dotenv from 'dotenv';

dotenv.config();

export const config ={
  port: process.env.PORT, 
  mongoUri: process.env.MONGOURI_CONNECTION,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  sessionSecret: process.env.SESSION_SECRET,
};