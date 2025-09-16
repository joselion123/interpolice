import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { upload } from '../config/multerConfig.js';
import { handleMulterErrors } from '../middlewares/upload.js';
import CiudadanoController from '../controllers/CiudadanoController.js';
import { verificarToken, verificarPolicia, verificarPropietario } from '../middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ciudadano = express.Router();

ciudadano.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

ciudadano.post("/ciudadano/login", CiudadanoController.login);

ciudadano.get("/ciudadano/listarTodos", 
  verificarToken, 
  verificarPolicia, 
  CiudadanoController.listarTodos
);

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

ciudadano.get("/ciudadano/buscarporcodigo/:codigo", 
  verificarToken,
  verificarPropietario,
  CiudadanoController.buscarPorCodigo
);

ciudadano.delete("/ciudadano/eliminarporcodigo/:codigo", 
  verificarToken,
  verificarPolicia,
  CiudadanoController.eliminarPorCodigo
);

ciudadano.put("/ciudadano/editar/:codigo", 
  verificarToken,
  verificarPolicia,
  CiudadanoController.editar
);

ciudadano.get("/ciudadano/qr/:codigo", 
  verificarToken,
  verificarPropietario,
  CiudadanoController.generarQR
);

export default ciudadano;