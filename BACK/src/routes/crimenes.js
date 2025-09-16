import express from "express";
import CrimenesController from '../controllers/CrimenesController.js';
import { verificarToken, verificarPolicia } from '../middlewares/auth.js';

const crimenes = express.Router();

crimenes.get("/crimenes/porcodigo/:codigo", 
    verificarToken,
    CrimenesController.buscarPorCodigo
);

crimenes.get("/crimenes/listar", 
    verificarToken,
    verificarPolicia,
    CrimenesController.listarTodos
);

crimenes.post("/crimenes/insertar", 
    verificarToken,
    verificarPolicia,
    CrimenesController.insertar
);

export default crimenes;