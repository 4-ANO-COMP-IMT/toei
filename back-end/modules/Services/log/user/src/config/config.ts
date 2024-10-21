import dotenv from 'dotenv';

dotenv.config();

export const config ={
  port: process.env.PORT, 
  mongoUri: process.env.MONGOURI_CONNECTION,
  sessionSecret: process.env.SESSION_SECRET,
  bridgeUrl: process.env.BRIDGE_URL,
  reactUrl: process.env.REACT_URL,
  flutterUrl: process.env.FLUTTER_URL
}