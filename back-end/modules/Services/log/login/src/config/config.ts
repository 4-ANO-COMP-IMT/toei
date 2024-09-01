import dotenv from 'dotenv';

dotenv.config();

export const config ={
  port: process.env.PORT, 
  mongoUri: process.env.MONGOURI_CONNECTION,
  sessionSecret: process.env.SESSION_SECRET,
  sessionMaxAge:(
    (
      (
        Number(process.env.SESSION_MAX_AGE_D) * 24 +
        Number(process.env.SESSION_MAX_AGE_H)
      ) * 60
    ) + Number(process.env.SESSION_MAX_AGE_M)
  ) * 60 * 1000
};