import { UsuarioModel } from '../models/usuario.model.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { generateToken } from '../utils/generateToken.js';

export const AuthController = {
  async register(req, res, next) {
    try {
      const { nombre, correo, password, telefono, tipo_usuario } = req.body;
      
      const existingUser = await UsuarioModel.findByEmail(correo);
      if (existingUser) {
        const error = new Error('El correo electrónico ya se encuentra registrado.');
        error.statusCode = 400;
        throw error;
      }

      const hashedPassword = await hashPassword(password);
      const newUserId = await UsuarioModel.create({
        nombre,
        correo,
        password: hashedPassword,
        telefono,
        tipo_usuario
      });

      const user = await UsuarioModel.findById(newUserId);
      const token = generateToken({ id: user.idusuarios, correo: user.correo, rol: user.tipo_usuario });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { correo, password } = req.body;
      const user = await UsuarioModel.findByEmail(correo);

      if (!user) {
        const error = new Error('Credenciales inválidas.');
        error.statusCode = 401;
        throw error;
      }

      if (user.estado === 0) {
        const error = new Error('La cuenta se encuentra inactiva.');
        error.statusCode = 403;
        throw error;
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        const error = new Error('Credenciales inválidas.');
        error.statusCode = 401;
        throw error;
      }

      const token = generateToken({ id: user.idusuarios, correo: user.correo, rol: user.tipo_usuario });

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: user.idusuarios,
            nombre: user.nombre,
            correo: user.correo,
            rol: user.tipo_usuario
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
};