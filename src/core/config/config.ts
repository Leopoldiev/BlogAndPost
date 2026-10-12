import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  PORT: process.env.PORT || 5005,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'password',
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'OpenSAML',
  ACCESS_TOKEN_EXP_TIME: Number(process.env.ACCESS_TOKEN_EXP_TIME) || 900,
};
