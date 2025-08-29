class CiudadanoValidator {
  
  static validarLogin(datos) {
    const { codigo, pass } = datos;
    
    if (!codigo || !pass) {
      return {
        valido: false,
        mensaje: "Código y contraseña son requeridos"
      };
    }
    
    if (codigo.length < 3) {
      return {
        valido: false,
        mensaje: "El código debe tener al menos 3 caracteres"
      };
    }
    
    return { valido: true };
  }
  
  static validarCreacion(datos) {
    const { nombre, apellidos, codigo_qr, rol, pass } = datos;
    
    if (!nombre || !apellidos || !codigo_qr || !rol || !pass) {
      return {
        valido: false,
        mensaje: "Nombre, apellidos, código QR, rol y contraseña son requeridos"
      };
    }
    
    if (!['policia', 'ciudadano'].includes(rol)) {
      return {
        valido: false,
        mensaje: "El rol debe ser 'policia' o 'ciudadano'"
      };
    }
    
    if (pass.length < 4) {
      return {
        valido: false,
        mensaje: "La contraseña debe tener al menos 4 caracteres"
      };
    }
    
    return { valido: true };
  }
  
  static validarActualizacion(datos) {
    const camposRequeridos = ['nombre', 'apellidos'];
    const camposFaltantes = camposRequeridos.filter(campo => !datos[campo]);
    
    if (camposFaltantes.length > 0) {
      return {
        valido: false,
        mensaje: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`
      };
    }
    
    return { valido: true };
  }
}

export default CiudadanoValidator;