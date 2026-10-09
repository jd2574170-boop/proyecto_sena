import { MuestraModel } from '../models/muestra.model.js';

export const MuestraController = {
  async crearTipo(req, res, next) {
    try {
      const { nombre_tipo, descripcion } = req.body;
      const id = await MuestraModel.crearTipoMuestra({ nombre_tipo, descripcion });
      res.status(201).json({ success: true, message: 'Tipo de muestra creado con éxito', data: { id, nombre_tipo, descripcion } });
    } catch (error) {
      next(error);
    }
  },

  async listarTipos(req, res, next) {
    try {
      const tipos = await MuestraModel.obtenerTiposMuestra();
      res.status(200).json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  },

  async agregarMuestra(req, res, next) {
    try {
      const { descripcion, cantidad, tipos_muestra_idtipomuestra, solicitudes_idsolicitud } = req.body;
      const codigo_muestra = `MUE-${Math.floor(100000 + Math.random() * 900000)}`;

      const idmuestra = await MuestraModel.crearMuestra({
        codigo_muestra,
        descripcion,
        cantidad,
        tipos_muestra_idtipomuestra,
        solicitudes_idsolicitud
      });

      res.status(201).json({
        success: true,
        message: 'Muestra agregada correctamente',
        data: { idmuestra, codigo_muestra, descripcion, cantidad, solicitudes_idsolicitud }
      });
    } catch (error) {
      next(error);
    }
  },

  async listarPorSolicitud(req, res, next) {
    try {
      const { solicitudId } = req.params;
      const muestras = await MuestraModel.obtenerPorSolicitud(solicitudId);
      res.status(200).json({ success: true, data: muestras });
    } catch (error) {
      next(error);
    }
  }
};