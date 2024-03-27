//archivo de configuracion
import express from "express";
import dotenv from "dotenv" //se instalo dotenv para crear variables de entorno personalizadas
import conectarDB from "./config/db.js";
import cors from "cors"
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";


const app = express();
app.use(express.json()); //habilita el poder obtener informacion del request.body

dotenv.config();//para que funcione dotenv

const PORT = process.env.PORT || 4000;

conectarDB()

//configurar cors para permitir peticiones
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            //puede consultar API
            callback(null, true);
        } else {
            //no esta permitido
            callback(new Error("error de cors"))
        }
    }
}

app.use(cors(corsOptions))

//Routing
app.use("/api/usuarios",usuarioRoutes); //se crea una ruta principal para usuarios  //use quiere decir todos los verbos http (post, get, delete, put )
app.use("/api/proyectos",proyectoRoutes);
app.use("/api/tareas",tareaRoutes);

app.listen(PORT, ()=>{
    console.log(`servidor corriendo en puerto ${PORT}`);
});