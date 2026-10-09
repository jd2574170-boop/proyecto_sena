import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, ENV.jwtSecret, { expiresIn: '8h' });
};