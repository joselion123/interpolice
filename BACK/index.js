
import express from "express";
import dotenv from "dotenv"; 
import ciudadano from "./src/ciudadanos.js";
import cors from "cors"


const app = express();

app.use(express.json());
app.use(cors());
app.use("/", ciudadano);

//Primer ruta


app.get("/", (req, res) => {
    res.send('Hola mundo del node.js exprress y las abiertas apis!')
    
});
const puerto =process.env.APP_PORT || 4300;
app.listen(puerto, () => {
    console.log(`Api ejecutandose en el puerto ${puerto}`)
});