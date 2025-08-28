import mysql from "mysql2/promise"
import dotenv from "dotenv";
dotenv.config();

// Pool de conexiones para mejor manejo (NECESARIO PARA RENDER)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'interpolice',
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Configuraciones para producción/Render
  acquireTimeout: 60000,
  timeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Verificar conexión al inicializar
async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
  } catch (err) {
    console.log("❌ Error al conectar a MySQL:", err.message);
  }
}

// Verificar conexión al cargar el módulo
verificarConexion();

export default pool;
