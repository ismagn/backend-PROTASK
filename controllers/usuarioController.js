import Usuario from "../models/Usuario.js";
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'
import {emailRegistro} from '../helpers/emails.js'
import {emailOlvidoPassword} from '../helpers/emails.js'


const registrar = async (req, res) =>{
    //evitar registros duplicados
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email}); //el findOne busca el primer resitro que coincida con el valor indicado

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message})
    }

    try {
        //añadir usuario a la BD
        const usuario = new Usuario(req.body) //el req.body es lo que el usuario mando al servidor al dar submit
        usuario.token = generarId()
         await usuario.save()
         //enviar el email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: "usuario creado correctamente, por favor confirma tu cuenta desde el mail que enviamos a tu correo"})  
    } catch (error) {
        console.log(error);
    }
    
}

const autenticar = async(req, res)=>{
    const {email,password} = req.body

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        const error = new Error("el usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    //comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("tu cuenta no esta confitmada");
        return res.status(403).json({msg: error.message});
    }

    //comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
            msg: "Iniciando Sesion"
        })
    } else {
        const error = new Error("el password es incorrecto");
        return res.status(403).json({msg: error.message});
    }
}

const confirmar = async(req,res)=>{
    const {token} = req.params //extrae el token de la url)
    const usuarioConfirmar = await Usuario.findOne({token}) //busca un registro con ese token
    if (!usuarioConfirmar) {
        const error = new Error("el token caducó o es incorrecto ");
        return res.status(403).json({msg: error.message});
    }

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save()
        res.json({msg: "usuario confirmado correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const olvidoPassword = async(req,res)=>{
    //comprobar si el usuario existe
    const {email} = req.body; 
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        const error = new Error("el usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuario.token = generarId();
        await usuario.save()

        emailOlvidoPassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        
        res.json({msg: "hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req , res) => {
    const {token} = req.params;
    const tokenValido = await Usuario.findOne({token})
    
    if (tokenValido) {
        res.json({ msg: "token valido y el usuario existe"})
    } else {
        const error = new Error("token no valido");
        return res.status(404).json({msg: error.message});
    }
}
const nuevoPassword = async (req , res) => {
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({token})
    
    if (usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save()
            res.json({msg: "password actualizado correctamente "})
        } catch (error) {
            console.log(error);
        }
        
    } else {
        const error = new Error("token no vlido");
        return res.status(404).json({msg: error.message});
    }

}

const perfil = async (req , res) => {
    const {usuario} = req
    res.json(usuario)
}


export {
    registrar,
    autenticar,
    confirmar,
    olvidoPassword,
    comprobarToken,
    nuevoPassword,
    perfil
}