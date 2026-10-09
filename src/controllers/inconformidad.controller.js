import { InconformidadModel } from '../models/inconformidad.model.js';

export const InconformidadController = {
  async crear(req, res, next) {
    try {
      const { descripcion_problema, solicitudes_idsolicitud } = req.body;
      const userId = req.user.id;

      const id = await InconformidadModel.create({
        descripcion_problema,
        solicitudes_idsolicitud,
        usuarios_idusuarios: userId
      });

      res.status(201).json({
        success: true,
        message: 'Inconformidad registrada exitosamente',
        data: { id, descripcion_problema, solicitudes_idsolicitud }
      });
    } catch (error) {
      next(error);
    }
  },

  async listar(req, res, next) {
    try {
      const inconformidades = await InconformidadModel.findAll();
      res.status(200).json({ success: true, data: inconformidades });
    } catch (error) {
      next(error);
    }
  }
};