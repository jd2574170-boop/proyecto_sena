import pool from '../config/database.js';

export const InconformidadModel = {
  async create(data) {
    const { descripcion_problema, solicitudes_idsolicitud, usuarios_idusuarios } = data;
    const [result] = await pool.query(
      'INSERT INTO inconformidades (descripcion_problema, solicitudes_idsolicitud, usuarios_idusuarios) VALUES (?, ?, ?)',
      [descripcion_problema, solicitudes_idsolicitud, usuarios_idusuarios]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(`
      SELECT i.*, u.nombre AS usuario_nombre, s.numero_radicado
      FROM inconformidades i
      INNER JOIN usuarios u ON i.usuarios_idusuarios = u.idusuarios
      INNER JOIN solicitudes s ON i.solicitudes_idsolicitud = s.idsolicitud
      ORDER BY i.fecha_reporte DESC
    `);
    return rows;
  }
};