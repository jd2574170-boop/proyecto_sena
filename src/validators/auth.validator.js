import { body, validationResult } from 'express-validator';

// Middleware auxiliar para verificar si hubo errores de validación
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación en los datos de entrada',
      errors: errors.array()
    });
  }
  next();
};

export const validateRegister = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('correo')
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('tipo_usuario')
    .notEmpty().withMessage('El tipo de usuario es obligatorio')
    .isIn(['Administrador', 'Personal', 'Cliente']).withMessage('Tipo de usuario no válido'),
  validateResult
];

export const validateLogin = [
  body('correo')
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  validateResult
];