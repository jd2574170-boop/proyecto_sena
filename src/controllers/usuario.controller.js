import pool from '../config/database.js';

export const UsuarioController = {
  // Listar todos los usuarios (Ideal para panel de Administrador)
  async listarTodos(req, res, next) {
    try {
      const [rows] = await pool.query(
        'SELECT idusuarios, nombre, correo, telefono, tipo_usuario, estado, fecha_registro FROM usuarios'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      next(error);
    }
  },

  // Obtener el perfil del usuario autenticado actual
  async obtenerPerfil(req, res, next) {
    try {
      const userId = req.user.id;

      const [rows] = await pool.query(
        'SELECT idusuarios, nombre, correo, telefono, tipo_usuario, estado, fecha_registro FROM usuarios WHERE idusuarios = ?',
        [userId]
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
  },

  // Cambiar el estado (Activo / Inactivo) de un usuario
  async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body; // Espera 1 (Activo) o 0 (Inactivo)

      if (estado !== 0 && estado !== 1) {
        const error = new Error('El estado no es válido (debe ser 0 o 1).');
        error.statusCode = 400;
        throw error;
      }

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
        message: 'Estado del usuario actualizado exitosamente',
        data: { idusuarios: id, estado }
      });
    } catch (error) {
      next(error);
    }
  }
};