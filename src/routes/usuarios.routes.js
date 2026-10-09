import { Router } from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Todas las rutas de usuarios exigen token activo
router.use(verifyToken);

// Listar todos los usuarios (Solo Administradores)
router.get('/', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT idusuarios, nombre, correo, telefono, tipo_usuario, estado, fecha_registro FROM usuarios'
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Obtener el perfil del usuario autenticado actual
router.get('/perfil', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT idusuarios, nombre, correo, telefono, tipo_usuario, estado, fecha_registro FROM usuarios WHERE idusuarios = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      const error = new Error('Usuario no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Cambiar estado de un usuario (Activo / Inactivo - Solo Administradores)
router.patch('/:id/estado', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 1 (Activo) o 0 (Inactivo)

    const [result] = await pool.query(
      'UPDATE usuarios SET estado = ? WHERE idusuarios = ?',
      [estado, id]
    );

    if (result.affectedRows === 0) {
      const error = new Error('Usuario no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Estado del usuario actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;