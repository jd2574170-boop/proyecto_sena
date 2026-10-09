import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API REST LIMS Nutricional activa y funcionando 🚀',
  });
});

// Enrutador global de la API (/api/v1)
app.use('/api/v1', apiRouter);

// Manejador global de errores (Debe ir al final de todas las rutas)
app.use(errorHandler);

export default app;