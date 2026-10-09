import { body, validationResult } from 'express-validator';

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación en la solicitud',
      errors: errors.array()
    });
  }
  next();
};

export const validateCreateSolicitud = [
  body('observaciones')
    .optional()
    .isString().withMessage('Las observaciones deben ser un texto válido')
    .isLength({ max: 500 }).withMessage('Las observaciones no pueden superar los 500 caracteres'),
  validateResult
];