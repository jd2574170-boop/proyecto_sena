import { BitacoraModel } from '../models/bitacora.model.js';

export const BitacoraController = {
  async listar(req, res, next) {
    try {
      const bitacoras = await BitacoraModel.findAll();
      res.status(200).json({ success: true, data: bitacoras });
    } catch (error) {
      next(error);
    }
  }
};