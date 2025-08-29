import conexion from '../conexion.js';

class CiudadanoModel {
  
  // Obtener todos los ciudadanos
  static async obtenerTodos() {
    const consulta = "SELECT * FROM ciudadanos";
    const [resultado] = await conexion.query(consulta);
    return resultado;
  }

  // Buscar ciudadano por código
  static async buscarPorCodigo(codigo) {
    const consulta = "SELECT * FROM ciudadanos WHERE codigo = ?";
    const [resultado] = await conexion.query(consulta, [codigo]);
    return resultado;
  }

  // Crear nuevo ciudadano
  static async crear(datosCiudadano) {
    const consulta = "INSERT INTO ciudadanos SET ?";
    const [resultado] = await conexion.query(consulta, [datosCiudadano]);
    return resultado;
  }

  // Actualizar ciudadano
  static async actualizar(codigo, datosCiudadano) {
    const consulta = "UPDATE ciudadanos SET ? WHERE codigo = ?";
    const [resultado] = await conexion.query(consulta, [datosCiudadano, codigo]);
    return resultado;
  }

  // Eliminar ciudadano
  static async eliminar(codigo) {
    const consulta = "DELETE FROM ciudadanos WHERE codigo = ?";
    const [resultado] = await conexion.query(consulta, [codigo]);
    return resultado;
  }

  // Buscar por credenciales (para login)
  static async buscarPorCredenciales(codigo) {
    const consulta = "SELECT * FROM ciudadanos WHERE codigo = ?";
    const [usuarios] = await conexion.query(consulta, [codigo]);
    return usuarios;
  }

  // Verificar si existe ciudadano
  static async existe(codigo) {
    const resultado = await this.buscarPorCodigo(codigo);
    return resultado.length > 0;
  }
}

export default CiudadanoModel;