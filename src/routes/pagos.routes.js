import { Router } from 'express';
import { PagoController } from '../controllers/pago.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(verifyToken);

router.post('/', PagoController.registrar);
router.patch('/:id/verificar', authorizeRoles('Administrador', 'Personal'), PagoController.verificar);

export default router;