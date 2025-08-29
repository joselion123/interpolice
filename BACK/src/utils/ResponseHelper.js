class ResponseHelper {
  
  static success(res, data = null, mensaje = "Operación exitosa", codigo = 200) {
    return res.status(codigo).json({
      estado: "ok",
      mensaje,
      data
    });
  }
  
  static error(res, mensaje = "Error interno del servidor", codigo = 500, detalles = null) {
    const response = {
      estado: "error",
      mensaje
    };
    
    if (detalles && process.env.NODE_ENV === 'development') {
      response.detalles = detalles;
    }
    
    return res.status(codigo).json(response);
  }
  
  static notFound(res, mensaje = "Recurso no encontrado") {
    return this.error(res, mensaje, 404);
  }
  
  static unauthorized(res, mensaje = "No autorizado") {
    return this.error(res, mensaje, 401);
  }
  
  static forbidden(res, mensaje = "Acceso denegado") {
    return this.error(res, mensaje, 403);
  }
  
  static badRequest(res, mensaje = "Petición inválida") {
    return this.error(res, mensaje, 400);
  }
  
  static validationError(res, errores) {
    return res.status(422).json({
      estado: "error",
      mensaje: "Errores de validación",
      errores
    });
  }
}

export default ResponseHelper;