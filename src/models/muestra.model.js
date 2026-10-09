import pool from '../config/database.js';

export const MuestraModel = {
  async crearTipoMuestra(data) {
    const { nombre_tipo, descripcion } = data;
    const [result] = await pool.query(
      'INSERT INTO tipos_muestra (nombre_tipo, descripcion, estado) VALUES (?, ?, 1)',
      [nombre_tipo, descripcion || null]
    );
    return result.insertId;
  },

  async obtenerTiposMuestra() {
    const [rows] = await pool.query('SELECT * FROM tipos_muestra WHERE estado = 1');
    return rows;
  },

  async crearMuestra(data) {
    const { codigo_muestra, descripcion, cantidad, tipos_muestra_idtipomuestra, solicitudes_idsolicitud } = data;
    const [result] = await pool.query(
      'INSERT INTO muestras (codigo_muestra, descripcion, cantidad, tipos_muestra_idtipomuestra, solicitudes_idsolicitud) VALUES (?, ?, ?, ?, ?)',
      [codigo_muestra, descripcion, cantidad, tipos_muestra_idtipomuestra, solicitudes_idsolicitud]
    );
    return result.insertId;
  },

  async obtenerPorSolicitud(solicitudId) {
    const [rows] = await pool.query(`
      SELECT m.*, tm.nombre_tipo AS tipo_muestra_nombre
      FROM muestras m
      INNER JOIN tipos_muestra tm ON m.tipos_muestra_idtipomuestra = tm.idtipomuestra
      WHERE m.solicitudes_idsolicitud = ?
    `, [solicitudId]);
    return rows;
  }
};