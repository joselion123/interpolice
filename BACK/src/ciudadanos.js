import express, { response } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import conexion from "./conexion.js";
import QRCode from "qrcode";
import { upload, handleMulterErrors } from './config/multerConfig.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const CLAVE_JWT_SECRETA = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const TIEMPO_EXPIRACION_JWT = process.env.JWT_EXPIRES_IN || '1h';

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ estado: 'error', mensaje: 'Token requerido' });
  }
  
  try {
    const datosDecodificados = jwt.verify(token, CLAVE_JWT_SECRETA);
    req.usuario = datosDecodificados;
    next();
  } catch (error) {
    return res.status(401).json({ estado: 'error', mensaje: 'Token inválido' });
  }
};

// Middleware para verificar rol de policía
const verificarPolicia = (req, res, next) => {
  if (req.usuario.rol !== 'policia') {
    return res.status(403).json({ estado: 'error', mensaje: 'Acceso denegado - Se requiere rol de policía' });
  }
  next();
};

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let ciudadano = express.Router();

// Configuración para servir archivos estáticos
ciudadano.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

ciudadano.get("/ciudadano/listarTodos", verificarToken, verificarPolicia, async(req,res)=>{
    let consulta= "SELECT * FROM ciudadanos";

    try{
        let [resultado]=await conexion.query(consulta);
        res.send({
            estado:"ok",
            data:resultado
        })
    }catch(err){
        res.status(500).send({
            estado:"error",
            data:"Error 500 en el servidor"
        })
    }
});

ciudadano.post("/ciudadano/insertar", verificarToken, verificarPolicia, (req, res, next) => {
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
}, handleMulterErrors, async (req, res) => {
  try {
    let fotoPath = '';
    
    if (req.file) {
      fotoPath = '/uploads/' + req.file.filename;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.pass, salt);

    const datosCiudadano = {
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      apodo: req.body.apodo,
      fecha_nacimiento: req.body.fecha_nacimiento,
      planeta_origen: req.body.planeta_origen,
      planeta_residencia: req.body.planeta_residencia,
      foto: fotoPath, // Guardar solo la ruta del archivo
      codigo_qr: req.body.codigo_qr,
      estado: req.body.estado,
      rol: req.body.rol,
      pass: hashedPassword, 
    };

    const consulta = "INSERT INTO ciudadanos SET ?";
    await conexion.query(consulta, [datosCiudadano]);

    res.status(200).json({ 
      mensaje: "Ciudadano insertado correctamente",
      fotoUrl: fotoPath //   URL de la imagen
    });
  } catch (err) {
    console.error("Error al insertar ciudadano:", err.message);
    
    if (req.file) {
      const fs = await import('fs');
      const filePath = path.join(__dirname, '../../public/uploads', req.file.filename);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error al eliminar el archivo:', unlinkErr);
      });
    }
    
    res.status(500).json({ 
      error: "Error al insertar ciudadano",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

ciudadano.get("/ciudadano/buscarporcodigo/:codigo", verificarToken, async (req, res) => {
  
  try {
    let codigo = req.params.codigo;
    let consulta = "SELECT * FROM ciudadanos where codigo = ?";
    let [resultado] = await conexion.query(consulta, [codigo]);
    
    if (resultado.length == 0) {
      return res.send({
        estado: "Datos vacios",
        data: resultado,
        mensaje: "No hay datos con el codigo: " + codigo
      });
    }

    res.send({
      estado: "ok",
      data: resultado
    });
  }
  catch (e) {
    res.status(500).send({
      estado: "error",
      data: e.code + "=>" + e.message,
    })
    
  }
});

ciudadano.delete("/ciudadano/eliminarporcodigo/:codigo", verificarToken, verificarPolicia, async(req,res)=>{
  let codigo=req.params.codigo;
  try{
    
    let consulta="Delete from ciudadanos where codigo = ?";
      let [resultado]=await conexion.query(consulta,[codigo]);

        res.send({
            estado:"ok",
            data:resultado
        })
    }catch(err){
        res.status(500).send({
            estado:"error",
            codigo: codigo,
            data: err.message
        })
  }
})

ciudadano.put("/ciudadano/editar/:codigo", verificarToken, verificarPolicia, async (req, res) => {
  try {
    const codigo=req.params.codigo
    const datosCiudadano = {
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      apodo: req.body.apodo,
      fecha_nacimiento: req.body.fecha_nacimiento,
      planeta_origen: req.body.planeta_origen,
      planeta_residencia: req.body.planeta_residencia,
      estado: req.body.estado,
    };

    const consulta = "update ciudadanos SET ? where codigo= ?";
    await conexion.query(consulta, [datosCiudadano,codigo]);

    res.status(200).json({ mensaje: "Ciudadano editado correctamente" });
  } catch (err) {
    console.error("Error al editar ciudadano:", err.message);
    res.status(500).json({ error: "Error al editar ciudadano" });
  }
});

ciudadano.post("/ciudadano/login", async (req, res) => {
  try {
    const { codigo, pass } = req.body;
    
    const [usuarios] = await conexion.query('SELECT * FROM ciudadanos WHERE codigo = ?', [codigo]);
    
    if (usuarios.length === 0) {
      return res.status(401).json({
        estado: "error",
        mensaje: "Credenciales inválidas"
      });
    }
    
    const usuario = usuarios[0];
    
    const esPasswordValido = await bcrypt.compare(pass, usuario.pass);
    
    if (!esPasswordValido) {
      return res.status(401).json({
        estado: "error",
        mensaje: "Credenciales inválidas"
      });
    }
    
    // Crear payload del token (excluir datos sensibles)
    const datosUsuario = { ...usuario };
    delete datosUsuario.pass; // No incluir contraseña en el token
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.codigo, rol: usuario.rol },
      CLAVE_JWT_SECRETA,
      { expiresIn: TIEMPO_EXPIRACION_JWT }
    );
    
    res.status(200).json({
      estado: "ok",
      token,
      user: datosUsuario
    });
  }catch(err){
 res.status(500).send({
      estado: "error",
      data: err.code + "=>" + err.message,
    })
  }
})

ciudadano.get("/ciudadano/qr/:codigo", verificarToken, async (req, res) => {
  try {
    const codigo = req.params.codigo;
    // Generar QR con el valor del código
    const qrDataUrl = await QRCode.toDataURL(codigo);
    res.status(200).json({ qr: qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: "Error generando el QR" });
  }
});

export default ciudadano;
