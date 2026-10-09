import { Router } from 'express';
import authRoutes from './auth.routes.js';
import solicitudesRoutes from './solicitudes.routes.js';
import muestrasRoutes from './muestras.routes.js';
import pagosRoutes from './pagos.routes.js';
import inconformidadesRoutes from './inconformidades.routes.js';
import usuariosRoutes from './usuarios.routes.js';
import resultadosRoutes from './resultados.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/solicitudes', solicitudesRoutes);
router.use('/muestras', muestrasRoutes);
router.use('/pagos', pagosRoutes);
router.use('/inconformidades', inconformidadesRoutes);
router.use('/resultados', resultadosRoutes);

export default router;