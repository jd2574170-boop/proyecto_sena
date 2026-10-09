import pool from '../config/database.js';

export const BitacoraModel = {
  async create(data) {
    const { accion, modulo, detalles, usuarios_idusuarios } = data;
    const [result] = await pool.query(
      'INSERT INTO bitacoras (accion, modulo, detalles, usuarios_idusuarios) VALUES (?, ?, ?, ?)',
      [accion, modulo, detalles || null, usuarios_idusuarios]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(`
      SELECT b.*, u.nombre AS usuario_nombre, u.correo
      FROM bitacoras b
      INNER JOIN usuarios u ON b.usuarios_idusuarios = u.idusuarios
      ORDER BY b.fecha_accion DESC
    `);
    return rows;
  }
};