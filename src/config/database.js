import mysql from 'mysql2/promise';
import { ENV } from './environment.js';

const pool = mysql.createPool({
  host: ENV.db.host,
  user: ENV.db.user,
  password: ENV.db.password,
  database: ENV.db.database,
  port: ENV.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos MySQL');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos MySQL:', error.message);
    process.exit(1);
  }
};

export default pool;