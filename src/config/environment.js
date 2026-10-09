import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 3306,
  },
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  nodeEnv: process.env.NODE_ENV || 'development',
};