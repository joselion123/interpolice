import express, { response } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { upload, handleMulterErrors } from './config/multerConfig.js';
import CiudadanoController from './controllers/CiudadanoController.js';
import { verificarToken, verificarPolicia, verificarPropietario } from './middlewares/auth.js';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ciudadano = express.Router();

// Configuración para servir archivos estáticos
ciudadano.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ==========================================
// RUTAS PÚBLICAS (Sin autenticación)
// ==========================================

// Login
ciudadano.post("/ciudadano/login", CiudadanoController.login);

// RUTA TEMPORAL - ELIMINAR EN PRODUCCIÓN
ciudadano.post("/ciudadano/generar-token-prueba", CiudadanoController.generarTokenPrueba);

// ==========================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// ==========================================

// Listar todos (Solo policía)
ciudadano.get("/ciudadano/listarTodos", 
  verificarToken, 
  verificarPolicia, 
  CiudadanoController.listarTodos
);

// Insertar ciudadano (Solo policía)
ciudadano.post("/ciudadano/insertar", 
  verificarToken,
  verificarPolicia,
  (req, res, next) => {
    upload(req, res, function(err) {
      if (err) {
        return res.status(400).json({
          estado: 'error',
          mensaje: err.message || 'Error al subir el archivo',
          code: err.code
        });
      }
      next();
    });
  },
  handleMulterErrors,
  CiudadanoController.insertar
);

// Buscar por código (Usuario propietario o policía)
ciudadano.get("/ciudadano/buscarporcodigo/:codigo", 
  verificarToken,
  verificarPropietario,
  CiudadanoController.buscarPorCodigo
);

// Eliminar por código (Solo policía)
ciudadano.delete("/ciudadano/eliminarporcodigo/:codigo", 
  verificarToken,
  verificarPolicia,
  CiudadanoController.eliminarPorCodigo
);

// Editar ciudadano (Solo policía)
ciudadano.put("/ciudadano/editar/:codigo", 
  verificarToken,
  verificarPolicia,
  CiudadanoController.editar
);

// Generar QR (Usuario propietario o policía)
ciudadano.get("/ciudadano/qr/:codigo", 
  verificarToken,
  verificarPropietario,
  CiudadanoController.generarQR
);

export default ciudadano;
