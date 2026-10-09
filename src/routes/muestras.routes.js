import { Router } from 'express';
import { MuestraController } from '../controllers/muestra.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/tipos', MuestraController.listarTipos);
router.post('/tipos', authorizeRoles('Administrador'), MuestraController.crearTipo);

router.post('/', MuestraController.agregarMuestra);
router.get('/solicitud/:solicitudId', MuestraController.listarPorSolicitud);

export default router;