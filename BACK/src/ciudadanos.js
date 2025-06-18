import express, {response} from "express";

import conexion from "./conexion.js";

let ciudadano=express.Router();

ciudadano.get("/ciudadano/listarTodos", async(req,res)=>{
    let consulta= "SELECT * FROM ciudadanos";

    try{
        let [resultado]=await conexion.query(consulta);
        res.send({resultado});
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

ciudadano.post("/insertar", async (req, res) => {
  try {
    const datosCiudadano = {
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      apodo: req.body.apodo,
      fecha_nacimiento: req.body.fecha_nacimiento,
      planeta_origen: req.body.planeta_origen,
      planeta_residencia: req.body.planeta_residencia,
      foto: req.body.foto,
      codigo_qr: req.body.codigo_qr,
      estado: req.body.estado,
    };

    const consulta = "INSERT INTO ciudadano SET ?";
    await dbConexion.query(consulta, [datosCiudadano]);

    res.status(200).json({ mensaje: "Ciudadano insertado correctamente" });
  } catch (err) {
    console.error("Error al insertar ciudadano:", err.message);
    res.status(500).json({ error: "Error al insertar ciudadano" });
  }
});

export default ciudadano;
