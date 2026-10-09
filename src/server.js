import app from './app.js';
import { ENV } from './config/environment.js';
import { testDatabaseConnection } from './config/database.js';

const startServer = async () => {
  // Verifica la conexión a MySQL antes de iniciar el servidor HTTP
  await testDatabaseConnection();

  app.listen(ENV.port, () => {
    console.log(`🚀 Servidor corriendo exitosamente en el puerto ${ENV.port} (${ENV.nodeEnv})`);
  });
};

startServer();