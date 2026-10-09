import pool from '../config/database.js';

export const UsuarioModel = {
  async findByEmail(correo) {
    const [rows] = await pool.query(
      'SELECT idusuarios, nombre, correo, password, tipo_usuario, estado FROM usuarios WHERE correo = ?',
      [correo]
    );
    return rows[0];
  },

  async create(userData) {
    const { nombre, correo, password, telefono, tipo_usuario } = userData;
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, telefono, tipo_usuario, estado) VALUES (?, ?, ?, ?, ?, 1)',
      [nombre, correo, password, telefono, tipo_usuario]
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT idusuarios, nombre, correo, telefono, tipo_usuario, estado, fecha_registro FROM usuarios WHERE idusuarios = ?',
      [id]
    );
    return rows[0];
  },
};