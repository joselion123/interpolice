import CrimenesModel from '../models/CrimenesModel.js';
import CrimenesValidator from '../validators/CrimenesValidator.js';
import ResponseHelper from '../utils/ResponseHelper.js';

class CrimenesController {
    static async buscarPorCodigo(req, res) {
        try {
            const codigo = req.params.codigo;
            
            const validacion = CrimenesValidator.validarCodigoCiudadano(codigo);
            if (!validacion.esValido) {
                return ResponseHelper.badRequest(res, validacion.errores.join(', '));
            }

            const resultado = await CrimenesModel.buscarPorCodigo(codigo);
            
            if (resultado.length === 0) {
                return ResponseHelper.notFound(res, [], `No se encontraron crímenes para el ciudadano con código: ${codigo}`);
            }
            
            ResponseHelper.success(res, resultado, `Se encontraron ${resultado.length} crímenes para el ciudadano con código: ${codigo}`);
            
        } catch (err) {
            console.error("Error al obtener crímenes por código:", err);
            ResponseHelper.error(res, err.message, "Error interno del servidor al consultar crímenes");
        }
    }

    static async listarTodos(req, res) {
        try {
            const resultado = await CrimenesModel.listarTodos();
            
            ResponseHelper.success(res, resultado, `Se encontraron ${resultado.length} crímenes registrados`);
            
        } catch (err) {
            console.error("Error al listar crímenes:", err);
            ResponseHelper.error(res, err.message, "Error interno del servidor al listar crímenes");
        }
    }

    static async insertar(req, res) {
        try {
            const { codigo_ciudadano, descripcion, fecha_crimen, nivel_gravedad, estado_caso } = req.body;
            
            const validacion = CrimenesValidator.validarDatosInsertar(req.body);
            if (!validacion.esValido) {
                return ResponseHelper.badRequest(res, validacion.errores.join(', '));
            }

            const ciudadanoExiste = await CrimenesModel.verificarCiudadanoExiste(codigo_ciudadano);
            if (!ciudadanoExiste) {
                return ResponseHelper.badRequest(res, `No existe un ciudadano con código: ${codigo_ciudadano}`);
            }
            
            const datoscrimen = {
                codigo_ciudadano,
                descripcion,
                fecha_crimen,
                nivel_gravedad: nivel_gravedad || 'MEDIO',
                estado_caso: estado_caso || 'ABIERTO'
            };
            
            const resultado = await CrimenesModel.insertar(datoscrimen);
            
            ResponseHelper.created(res, { id: resultado.insertId, ...datoscrimen }, "Crimen registrado correctamente");
            
        } catch (err) {
            console.error("Error al insertar crimen:", err);
            ResponseHelper.error(res, err.message, "Error interno del servidor al registrar crimen");
        }
    }
}

export default CrimenesController;