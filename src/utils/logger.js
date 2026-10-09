import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear la carpeta 'logs' en la raíz del backend si no existe
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.existsSync(path.join(__dirname, '../../')) || fs.mkdirSync(path.join(__dirname, '../../logs'));
}

// Configurar un stream de escritura para guardar los logs en un archivo rotativo o diario
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);

// Middleware de Morgan para desarrollo (muestra en consola con colores)
export const morganDev = morgan('dev');

// Middleware de Morgan para producción (guarda los registros detallados en el archivo access.log)
export const morganCombined = morgan('combined', { stream: accessLogStream });