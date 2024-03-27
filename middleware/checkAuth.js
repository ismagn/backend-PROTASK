import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";


const checKAuth = async (req,res,next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]//el split borra la primera cadena en este caso la palabra 'Bearer' y asigna el otro valor a la variable

            const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify decifra el token enviado desde el rontend

            //busca el usuario de la base de datos que coincida con el id del token y lo asigna al request
            req.usuario = await Usuario.findById(decoded.id).select("-password") //el select es para seleccionar los atributos que se van a agregar o quitar, en este caso se quita password y se agrega la demas informacion al request
            return next()
        } catch (error) {
            return res.status(404).json({msg : "hubo un error"})
        }
    } 

    if (!token) {
        const error = new Error("token no valido")
        return res.status(401).json({msg: error.message})
    }

    next()
}

export default checKAuth;