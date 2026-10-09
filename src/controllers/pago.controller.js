import { PagoModel } from '../models/pago.model.js';

export const PagoController = {
  async registrar(req, res, next) {
    try {
      const { monto, comprobante_url, solicitudes_idsolicitud } = req.body;
      const userId = req.user.id;

      const pagoExistente = await PagoModel.findBySolicitud(solicitudes_idsolicitud);
      if (pagoExistente) {
        const error = new Error('Ya existe un pago registrado para esta solicitud.');
        error.statusCode = 400;
        throw error;
      }

      const idpago = await PagoModel.create({
        monto,
        comprobante_url,
        solicitudes_idsolicitud,
        usuarios_idusuarios: userId
      });

      res.status(201).json({
        success: true,
        message: 'Comprobante de pago registrado correctamente',
        data: { idpago, monto, comprobante_url, estado_pago: 'Pendiente de verificación', solicitudes_idsolicitud }
      });
    } catch (error) {
      next(error);
    }
  },

  async verificar(req, res, next) {
    try {
      const { id } = req.params;
      const { estado_pago } = req.body;

      const estadosPermitidos = ['Aprobado', 'Rechazado'];
      if (!estadosPermitidos.includes(estado_pago)) {
        const error = new Error('Estado de pago no válido.');
        error.statusCode = 400;
        throw error;
      }

      await PagoModel.updateEstado(id, estado_pago);

      res.status(200).json({
        success: true,
        message: 'Estado del pago actualizado exitosamente',
        data: { idpago: id, estado_pago }
      });
    } catch (error) {
      next(error);
    }
  }
};