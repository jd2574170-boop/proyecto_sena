import pool from '../config/database.js';

export const PagoModel = {
  async create(data) {
    const { monto, comprobante_url, solicitudes_idsolicitud, usuarios_idusuarios } = data;
    const [result] = await pool.query(
      'INSERT INTO pagos (monto, comprobante_url, estado_pago, solicitudes_idsolicitud, usuarios_idusuarios) VALUES (?, ?, "Pendiente de verificación", ?, ?)',
      [monto, comprobante_url, solicitudes_idsolicitud, usuarios_idusuarios]
    );
    return result.insertId;
  },

  async findBySolicitud(solicitudId) {
    const [rows] = await pool.query('SELECT * FROM pagos WHERE solicitudes_idsolicitud = ?', [solicitudId]);
    return rows[0];
  },

  async updateEstado(id, estado_pago) {
    const [result] = await pool.query('UPDATE pagos SET estado_pago = ? WHERE idpago = ?', [estado_pago, id]);
    return result.affectedRows > 0;
  }
};