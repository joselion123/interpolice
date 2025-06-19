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

ciudadano.post("/ciudadano/insertar", async (req, res) => {
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

    const consulta = "INSERT INTO ciudadanos SET ?";
    await conexion.query(consulta, [datosCiudadano]);

    res.status(200).json({ mensaje: "Ciudadano insertado correctamente" });
  } catch (err) {
    console.error("Error al insertar ciudadano:", err.message);
    res.status(500).json({ error: "Error al insertar ciudadano" });
  }
});

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

ciudadano.get("/ciudadano/buscarporcodigo/:codigo", async (req, res) => {
  
  try {
    let codigo = req.params.codigo;
    let consulta = "SELECT * FROM ciudadanos where codigo = ?";
    let [resultado] = await conexion.query(consulta, [codigo]);
    
    if (resultado.length == 0) {
      res.send({ res: "No hay datos con el codigo: " + codigo });
      res.send({
        estado: "Datos vacios",
        data: resultado,
      });
    }

    res.send({ resultado });
    res.send({
      estado: "ok",
      data: resultado,
    });
  }
  catch (e) {
    res.status(500).send({
      estado: "error",
      data: e.code + "=>" + e.message,
    })
    
  }
});

ciudadano.delete("/ciudadano/eliminarporcodigo/:codigo", async(req,res)=>{
  let codigo=req.params.codigo;
  try{
    
    let consulta="Delete from ciudadanos where codigo = ?";
      let [resultado]=await conexion.query(consulta,[codigo]);

     res.send({resultado});
        res.send({
            estado:"ok",
            data:resultado
        })
    }catch(err){
        res.status(500).send({
            estado:"error",
            codigo: codigo,
            data: err.message
        })
  }
})

ciudadano.put("/ciudadano/editar/:codigo", async (req, res) => {
  try {
    const codigo=req.params.codigo
    const datosCiudadano = {
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      apodo: req.body.apodo,
      fecha_nacimiento: req.body.fecha_nacimiento,
      planeta_origen: req.body.planeta_origen,
      planeta_residencia: req.body.planeta_residencia,
      estado: req.body.estado,
    };

    const consulta = "update ciudadanos SET ? where codigo= ?";
    await conexion.query(consulta, [datosCiudadano,codigo]);

    res.status(200).json({ mensaje: "Ciudadano editado correctamente" });
  } catch (err) {
    console.error("Error al editar ciudadano:", err.message);
    res.status(500).json({ error: "Error al editar ciudadano" });
  }
});

export default ciudadano;
