import { Router } from 'express';
import { AuditoriaModel } from '../models/auditoria.model.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(verifyToken);

router.post('/', async (req, res, next) => {
  try {
    const { descripcion_problema, solicitudes_idsolicitud } = req.body;
    const id = await AuditoriaModel.registrarInconformidad({
      descripcion_problema,
      solicitudes_idsolicitud,
      usuarios_idusuarios: req.user.id
    });
    res.status(201).json({ success: true, message: 'Inconformidad registrada', data: { id } });
  } catch (error) {
    next(error);
  }
});

router.get('/', authorizeRoles('Administrador', 'Personal'), async (req, res, next) => {
  try {
    const incs = await AuditoriaModel.listarInconformidades();
    res.status(200).json({ success: true, data: incs });
  } catch (error) {
    next(error);
  }
});

export default router;