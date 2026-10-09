import pool from '../config/database.js';

export const ResultadoController = {
  // Registrar un resultado (lógica de negocio integrada aquí mismo)
  async registrar(req, res, next) {
    try {
      const { observaciones, solicitudes_idsolicitud } = req.body;
      const archivo_url = req.file ? req.file.path : null;
      const userId = req.user.id;

      if (!archivo_url) {
        const error = new Error('El archivo de resultado (PDF o imagen) es obligatorio.');
        error.statusCode = 400;
        throw error;
      }

      // 1. Verificar si la solicitud existe
      const [solicitudes] = await pool.query(
        'SELECT idsolicitud FROM solicitudes WHERE idsolicitud = ?',
        [solicitudes_idsolicitud]
      );

      if (solicitudes.length === 0) {
        const error = new Error('La solicitud especificada no existe.');
        error.statusCode = 404;
        throw error;
      }

      // 2. Insertar el resultado en la base de datos
      const [result] = await pool.query(
        'INSERT INTO resultados (archivo_url, observaciones, solicitudes_idsolicitud, usuarios_idusuarios) VALUES (?, ?, ?, ?)',
        [archivo_url, observaciones || null, solicitudes_idsolicitud, userId]
      );

      // 3. Actualizar el estado de la solicitud automáticamente a "Finalizada"
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
  },

  // Obtener resultados por solicitud con validación de roles integrada
  async obtenerPorSolicitud(req, res, next) {
    try {
      const { solicitudId } = req.params;
      const user = req.user;

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

      // Validación de seguridad de roles
      if (user.rol !== 'Administrador' && user.rol !== 'Personal' && solicitud.usuarios_idusuarios !== user.id) {
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
  }
};