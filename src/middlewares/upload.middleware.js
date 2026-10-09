import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento en disco (puedes cambiarlo a memoryStorage si guardas en la nube como Cloudinary o AWS S3)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegúrate de que la carpeta 'uploads/' exista en la raíz de tu backend
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtro para permitir solo ciertos tipos de archivos (ej: PDFs e imágenes para comprobantes)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG) y documentos PDF.');
    error.statusCode = 400;
    cb(error, false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5 Megabytes por archivo
  }
});

// Exportar middlewares específicos según lo que necesites
export const uploadSingleFile = (fieldName) => upload.single(fieldName);
export const uploadMultipleFiles = (fieldName, maxCount) => upload.array(fieldName, maxCount);