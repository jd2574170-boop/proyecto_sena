import { Router } from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { uploadSingleFile } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(verifyToken);

// Subir un resultado / certificado de análisis (Solo Administrador y Personal de laboratorio)
router.post('/', authorizeRoles('Administrador', 'Personal'), uploadSingleFile('archivo_resultado'), async (req, res, next) => {
  try {
    const { observaciones, solicitudes_idsolicitud } = req.body;
    const archivo_url = req.file ? req.file.path : null;

    if (!archivo_url) {
      const error = new Error('El archivo de resultado (PDF o imagen) es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const [result] = await pool.query(
      'INSERT INTO resultados (archivo_url, observaciones, solicitudes_idsolicitud, usuarios_idusuarios) VALUES (?, ?, ?, ?)',
      [archivo_url, observaciones || null, solicitudes_idsolicitud, req.user.id]
    );

    // Actualizar el estado de la solicitud a "Finalizada" automáticamente
    await pool.query(
      'UPDATE solicitudes SET estado = "Finalizada" WHERE idsolicitud = ?',
      [solicitudes_idsolicitud]
    );

    res.status(201).json({
      success: true,
      message: 'Resultado de análisis cargado y solicitud finalizada con éxito',
      data: {
        idresultado: result.insertId,
        archivo_url,
        solicitudes_idsolicitud
      }
    });
  } catch (error) {
    next(error);
  }
});

// Consultar los resultados asociados a una solicitud específica
router.get('/solicitud/:solicitudId', async (req, res, next) => {
  try {
    const { solicitudId } = req.params;

    // Verificar si la solicitud pertenece al usuario o si es personal autorizado
    const [solicitudes] = await pool.query(
      'SELECT usuarios_idusuarios FROM solicitudes WHERE idsolicitud = ?',
      [solicitudId]
    );

    if (solicitudes.length === 0) {
      const error = new Error('Solicitud no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    const solicitud = solicitudes[0];
    if (req.user.rol !== 'Administrador' && req.user.rol !== 'Personal' && solicitud.usuarios_idusuarios !== req.user.id) {
      const error = new Error('No tienes permisos para ver estos resultados.');
      error.statusCode = 403;
      throw error;
    }

    const [rows] = await pool.query(
      'SELECT * FROM resultados WHERE solicitudes_idsolicitud = ?',
      [solicitudId]
    );

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

export default router;