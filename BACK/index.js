import express from "express";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import ciudadano from "./src/ciudadanos.js";
import cors from "cors";
import crimenes from "./src/crimenes.js";

// Configuración de rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

require('dotenv').config();
dotenv.config();

const app = express();

// Configuración de middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Servir archivos estáticos desde la carpeta public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use("/", ciudadano);
app.use("/", crimenes);


// Ruta de prueba
app.get("/", (req, res) => {
    res.send('API de Interpolice - Sistema de registro de ciudadanos');
});

// Iniciar el servidor
const puerto = process.env.APP_PORT || 4300;
app.listen(puerto, () => {
    console.log(`API ejecutándose en el puerto ${puerto}`);
    console.log(`URL base: http://localhost:${puerto}`);
});