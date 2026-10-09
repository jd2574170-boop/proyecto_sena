import pool from '../config/database.js';

export const SolicitudModel = {
  async create(solicitudData) {
    const { numero_radicado, usuarios_idusuarios, observaciones } = solicitudData;
    const [result] = await pool.query(
      'INSERT INTO solicitudes (numero_radicado, usuarios_idusuarios, observaciones, estado) VALUES (?, ?, ?, "Pendiente")',
      [numero_radicado, usuarios_idusuarios, observaciones || null]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(`
      SELECT s.idsolicitud, s.numero_radicado, s.fecha_solicitud, s.estado, s.observaciones,
             u.idusuarios, u.nombre AS cliente_nombre, u.correo AS cliente_correo, u.tipo_usuario
      FROM solicitudes s
      INNER JOIN usuarios u ON s.usuarios_idusuarios = u.idusuarios
      ORDER BY s.fecha_solicitud DESC
    `);
    return rows;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT s.idsolicitud, s.numero_radicado, s.fecha_solicitud, s.estado, s.observaciones
      FROM solicitudes s
      WHERE s.usuarios_idusuarios = ?
      ORDER BY s.fecha_solicitud DESC
    `, [userId]);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT s.idsolicitud, s.numero_radicado, s.fecha_solicitud, s.estado, s.observaciones,
             u.idusuarios, u.nombre AS cliente_nombre, u.correo AS cliente_correo, u.tipo_usuario
      FROM solicitudes s
      INNER JOIN usuarios u ON s.usuarios_idusuarios = u.idusuarios
      WHERE s.idsolicitud = ?
    `, [id]);
    return rows[0];
  },

  async updateStatus(id, estado) {
    const [result] = await pool.query(
      'UPDATE solicitudes SET estado = ? WHERE idsolicitud = ?',
      [estado, id]
    );
    return result.affectedRows > 0;
  }
};