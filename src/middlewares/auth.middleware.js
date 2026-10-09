import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado. Token no proveído.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.jwtSecret);
    req.user = decoded; // Inyecta los datos del usuario en la petición
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado.' });
  }
};