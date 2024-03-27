import jwt from "jsonwebtoken";

const generarJWT = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET, {//sign genera el JWT, va a generar un tokn con un objeto con el id del usuario
        expiresIn: "30d" //expira en 30 dias
    }) 
}

export default generarJWT;