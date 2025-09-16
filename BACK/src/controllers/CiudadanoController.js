import CiudadanoModel from '../models/CiudadanoModel.js';
import CiudadanoValidator from '../validators/CiudadanoValidator.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLAVE_JWT_SECRETA = process.env.JWT_SECRET ;
const TIEMPO_EXPIRACION_JWT = process.env.JWT_EXPIRES_IN ;

class CiudadanoController {

  // Listar todos los ciudadanos
  static async listarTodos(req, res) {
    try {
      const resultado = await CiudadanoModel.obtenerTodos();
      res.send({
        estado: "ok",
        data: resultado
      });
    } catch (err) {
      console.error("Error al listar ciudadanos:", err.message);
      res.status(500).send({
        estado: "error",
        data: "Error 500 en el servidor"
      });
    }
  }

  // Insertar nuevo ciudadano
  static async insertar(req, res) {
    try {
      // Validar datos
      const validacion = CiudadanoValidator.validarCreacion(req.body);
      if (!validacion.valido) {
        return res.status(400).json({
          estado: "error",
          mensaje: validacion.mensaje
        });
      }
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
        foto: fotoPath,
        codigo_qr: req.body.codigo_qr,
        estado: req.body.estado,
        rol: req.body.rol,
        pass: hashedPassword,
      };

      await CiudadanoModel.crear(datosCiudadano);

      res.status(200).json({ 
        mensaje: "Ciudadano insertado correctamente",
        fotoUrl: fotoPath
      });
    } catch (err) {
      console.error("Error al insertar ciudadano:", err.message);
      
      // Si hay un error, eliminar el archivo subido si existe
      if (req.file) {
        const fs = await import('fs');
        const filePath = path.join(__dirname, '../../../public/uploads', req.file.filename);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error al eliminar el archivo:', unlinkErr);
        });
      }
      
      res.status(500).json({ 
        error: "Error al insertar ciudadano",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Buscar por código
  static async buscarPorCodigo(req, res) {
    try {
      const codigo = req.params.codigo;
      const resultado = await CiudadanoModel.buscarPorCodigo(codigo);
      
      if (resultado.length === 0) {
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
    } catch (e) {
      console.error("Error al buscar ciudadano:", e.message);
      res.status(500).send({
        estado: "error",
        data: e.code + "=>" + e.message,
      });
    }
  }

  // Eliminar por código
  static async eliminarPorCodigo(req, res) {
    try {
      const codigo = req.params.codigo;
      const resultado = await CiudadanoModel.eliminar(codigo);

      res.send({
        estado: "ok",
        data: resultado
      });
    } catch (err) {
      console.error("Error al eliminar ciudadano:", err.message);
      res.status(500).send({
        estado: "error",
        codigo: codigo,
        data: err.message
      });
    }
  }

  // Editar ciudadano
  static async editar(req, res) {
    try {
      // Validar datos
      const validacion = CiudadanoValidator.validarActualizacion(req.body);
      if (!validacion.valido) {
        return res.status(400).json({
          estado: "error",
          mensaje: validacion.mensaje
        });
      }
      const codigo = req.params.codigo;
      const datosCiudadano = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        apodo: req.body.apodo,
        fecha_nacimiento: req.body.fecha_nacimiento,
        planeta_origen: req.body.planeta_origen,
        planeta_residencia: req.body.planeta_residencia,
        estado: req.body.estado,
      };

      await CiudadanoModel.actualizar(codigo, datosCiudadano);

      res.status(200).json({ mensaje: "Ciudadano editado correctamente" });
    } catch (err) {
      console.error("Error al editar ciudadano:", err.message);
      res.status(500).json({ error: "Error al editar ciudadano" });
    }
  }

  // Login
  static async login(req, res) {
    try {
      // Validar datos de entrada
      const validacion = CiudadanoValidator.validarLogin(req.body);
      if (!validacion.valido) {
        return res.status(400).json({
          estado: "error",
          mensaje: validacion.mensaje
        });
      }
      const { codigo, pass } = req.body;
      
      const usuarios = await CiudadanoModel.buscarPorCredenciales(codigo);
      
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
      
      // Crear payload del token
      const datosUsuario = { ...usuario };
      delete datosUsuario.pass;
      
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
    } catch (err) {
      console.error("Error en login:", err.message);
      res.status(500).send({
        estado: "error",
        data: err.code + "=>" + err.message,
      });
    }
  }

  // Generar QR
  static async generarQR(req, res) {
    try {
      const codigo = req.params.codigo;
      const qrDataUrl = await QRCode.toDataURL(codigo);
      res.status(200).json({ qr: qrDataUrl });
    } catch (err) {
      console.error("Error generando QR:", err.message);
      res.status(500).json({ error: "Error generando el QR" });
    }
  }  
}

export default CiudadanoController;