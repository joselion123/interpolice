class CrimenesValidator {
    static validarDatosInsertar(datos) {
        const errores = [];

        if (!datos.codigo_ciudadano) {
            errores.push('El código del ciudadano es requerido');
        }

        if (!datos.descripcion || datos.descripcion.trim().length === 0) {
            errores.push('La descripción del crimen es requerida');
        }

        if (!datos.fecha_crimen) {
            errores.push('La fecha del crimen es requerida');
        }

        if (datos.nivel_gravedad && !['BAJO', 'MEDIO', 'ALTO'].includes(datos.nivel_gravedad)) {
            errores.push('El nivel de gravedad debe ser BAJO, MEDIO o ALTO');
        }

        if (datos.estado_caso && !['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'].includes(datos.estado_caso)) {
            errores.push('El estado del caso debe ser ABIERTO, EN_INVESTIGACION o CERRADO');
        }

        return {
            esValido: errores.length === 0,
            errores
        };
    }

    static validarCodigoCiudadano(codigo) {
        if (!codigo || typeof codigo !== 'string' || codigo.trim().length === 0) {
            return {
                esValido: false,
                errores: ['El código del ciudadano es requerido y debe ser válido']
            };
        }
        return { esValido: true, errores: [] };
    }
}

export default CrimenesValidator;