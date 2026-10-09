import { Router } from 'express';
import { SolicitudController } from '../controllers/solicitud.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Todas las rutas de solicitudes exigen token activo
router.use(verifyToken);

// Rutas para Clientes y Administradores
router.post('/', SolicitudController.crear);
router.get('/mis-solicitudes', SolicitudController.listarMisSolicitudes);
router.get('/:id', SolicitudController.obtenerPorId);

// Rutas exclusivas para Administradores / Personal interno
router.get('/', authorizeRoles('Administrador', 'Personal'), SolicitudController.listarTodas);
router.patch('/:id/estado', authorizeRoles('Administrador', 'Personal'), SolicitudController.cambiarEstado);

export default router;