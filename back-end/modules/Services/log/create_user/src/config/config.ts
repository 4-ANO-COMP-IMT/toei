import dotenv from 'dotenv';

dotenv.config();

export const config ={
  port: process.env.PORT || 3000,
  mongouri: process.env.MONGO_URI || 'mongodb://localhost:27017/test'
};