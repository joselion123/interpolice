import express from "express";
import conexion from "./conexion.js";

const crimenes = express.Router();

crimenes.get("/crimenes/porcodigo/:codigo", async (req, res) => {
    try {
        const codigo = req.params.codigo;
        
        const consulta = `
            SELECT c.*, cr.*
            FROM ciudadanos c 
            INNER JOIN crimenes cr ON c.codigo = cr.ciudadano_codigo 
            WHERE c.codigo = ?
        `;
        
        const [resultado] = await conexion.query(consulta, [codigo]);
        
        if (resultado.length === 0) {
            return res.status(404).send({
                estado: "No encontrado",
                data: [],
                mensaje: `No se encontraron crímenes para el ciudadano con código: ${codigo}`
            });
        }
        
        res.send({
            estado: "ok",
            data: resultado,
            mensaje: `Se encontraron ${resultado.length} crímenes para el ciudadano con código: ${codigo}`
        });
        
    } catch (err) {
        console.error("Error al obtener crímenes por código:", err);
        res.status(500).send({
            estado: "error",
            data: err.message,
            mensaje: "Error interno del servidor al consultar crímenes"
        });
    }
});

crimenes.get("/crimenes/listar", async (req, res) => {
    try {
        const consulta = `
            SELECT * from crimenes
        `;
        
        const [resultado] = await conexion.query(consulta);
        
        res.send({
            estado: "ok",
            data: resultado,
            mensaje: `Se encontraron ${resultado.length} crímenes registrados`
        });
        
    } catch (err) {
        console.error("Error al listar crímenes:", err);
        res.status(500).send({
            estado: "error",
            data: err.message,
            mensaje: "Error interno del servidor al listar crímenes"
        });
    }
});

crimenes.post("/crimenes/insertar", async (req, res) => {
    try {
        const { codigo_ciudadano, descripcion, fecha_crimen, nivel_gravedad, estado_caso } = req.body;
        
        const consultaCiudadano = "SELECT * FROM ciudadanos WHERE codigo = ?";
        const [ciudadanoExiste] = await conexion.query(consultaCiudadano, [codigo_ciudadano]);
        
        if (ciudadanoExiste.length === 0) {
            return res.status(400).send({
                estado: "error",
                mensaje: `No existe un ciudadano con código: ${codigo_ciudadano}`
            });
        }
        
        const datoscrimen = {
            codigo_ciudadano,
            descripcion,
            fecha_crimen,
            nivel_gravedad: nivel_gravedad || 'MEDIO',
            estado_caso: estado_caso || 'ABIERTO'
        };
        
        const consultaInsertar = "INSERT INTO crimenes SET ?";
        const [resultado] = await conexion.query(consultaInsertar, [datoscrimen]);
        
        res.status(201).send({
            estado: "ok",
            data: { id: resultado.insertId, ...datoscrimen },
            mensaje: "Crimen registrado correctamente"
        });
        
    } catch (err) {
        console.error("Error al insertar crimen:", err);
        res.status(500).send({
            estado: "error",
            data: err.message,
            mensaje: "Error interno del servidor al registrar crimen"
        });
    }
});

export default crimenes;