import { SolicitudModel } from '../models/solicitud.model.js';

export const SolicitudController = {
  async crear(req, res, next) {
    try {
      const userId = req.user.id;
      const { observaciones } = req.body;

      // Generar radicado único
      const fechaStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const numero_radicado = `RAD-${fechaStr}-${randomNum}`;

      const idsolicitud = await SolicitudModel.create({
        numero_radicado,
        usuarios_idusuarios: userId,
        observaciones
      });

      const nuevaSolicitud = await SolicitudModel.findById(idsolicitud);

      res.status(201).json({
        success: true,
        message: 'Solicitud creada exitosamente',
        data: nuevaSolicitud
      });
    } catch (error) {
      next(error);
    }
  },

  async listarTodas(req, res, next) {
    try {
      const solicitudes = await SolicitudModel.findAll();
      res.status(200).json({ success: true, data: solicitudes });
    } catch (error) {
      next(error);
    }
  },

  async listarMisSolicitudes(req, res, next) {
    try {
      const userId = req.user.id;
      const solicitudes = await SolicitudModel.findByUserId(userId);
      res.status(200).json({ success: true, data: solicitudes });
    } catch (error) {
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const solicitud = await SolicitudModel.findById(id);

      if (!solicitud) {
        const error = new Error('Solicitud no encontrada.');
        error.statusCode = 404;
        throw error;
      }

      if (req.user.rol !== 'Administrador' && req.user.rol !== 'Personal' && solicitud.idusuarios !== req.user.id) {
        const error = new Error('No tienes permisos para ver esta solicitud.');
        error.statusCode = 403;
        throw error;
      }

      res.status(200).json({ success: true, data: solicitud });
    } catch (error) {
      next(error);
    }
  },

  async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const solicitud = await SolicitudModel.findById(id);
      if (!solicitud) {
        const error = new Error('Solicitud no encontrada.');
        error.statusCode = 404;
        throw error;
      }

      const estadosValidos = ['Pendiente', 'En revisión', 'En proceso', 'Finalizada', 'Rechazada'];
      if (!estadosValidos.includes(estado)) {
        const error = new Error('Estado de solicitud no válido.');
        error.statusCode = 400;
        throw error;
      }

      await SolicitudModel.updateStatus(id, estado);
      const actualizada = await SolicitudModel.findById(id);

      res.status(200).json({
        success: true,
        message: 'Estado de solicitud actualizado correctamente',
        data: actualizada
      });
    } catch (error) {
      next(error);
    }
  }
};