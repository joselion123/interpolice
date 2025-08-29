import jwt from 'jsonwebtoken';

const CLAVE_JWT_SECRETA = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

// Middleware para verificar JWT
export const verificarToken = (req, res, next) => {
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
export const verificarPolicia = (req, res, next) => {
  if (req.usuario.rol !== 'policia') {
    return res.status(403).json({ estado: 'error', mensaje: 'Acceso denegado - Se requiere rol de policía' });
  }
  next();
};

// Middleware para verificar que el usuario puede acceder a sus propios datos
export const verificarPropietario = (req, res, next) => {
  const codigoRuta = req.params.codigo;
  const codigoUsuario = req.usuario.id;
  
  // Policía puede acceder a cualquier dato, usuario solo a sus datos
  if (req.usuario.rol === 'policia' || codigoUsuario === codigoRuta) {
    next();
  } else {
    return res.status(403).json({ estado: 'error', mensaje: 'Acceso denegado - Solo puedes acceder a tus propios datos' });
  }
};