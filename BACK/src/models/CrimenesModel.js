import conexion from '../conexion.js';

class CrimenesModel {
    static async buscarPorCodigo(codigo) {
        const consulta = `
            SELECT c.*, cr.*
            FROM ciudadanos c 
            INNER JOIN crimenes cr ON c.codigo = cr.ciudadano_codigo 
            WHERE c.codigo = ?
        `;
        const [resultado] = await conexion.query(consulta, [codigo]);
        return resultado;
    }

    static async listarTodos() {
        const consulta = `SELECT * FROM crimenes`;
        const [resultado] = await conexion.query(consulta);
        return resultado;
    }

    static async verificarCiudadanoExiste(codigoCiudadano) {
        const consulta = "SELECT * FROM ciudadanos WHERE codigo = ?";
        const [resultado] = await conexion.query(consulta, [codigoCiudadano]);
        return resultado.length > 0;
    }

    static async insertar(datoscrimen) {
        const consulta = "INSERT INTO crimenes SET ?";
        const [resultado] = await conexion.query(consulta, [datoscrimen]);
        return resultado;
    }
}

export default CrimenesModel;