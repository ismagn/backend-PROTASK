import mongoose from "mongoose";
import bcrypt from "bcrypt" //se utiliza para hashear passwords
import generarId from '../helpers/generarId.js'

const usuarioSchema = mongoose.Schema({
    nombre : {
        type: String,
        require: true,
        trim: true,  //quita espacios al inicio y al final al ingresar usuario la cadena de texto
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    token: {
        type: String,
    },
    confirmado : {
        type: Boolean,
        default: false,
    },
    },

    {
        timestamps: true,    //este va crear dos columnas mas, una de creado y otra de actualizado
    }
);

//este codigo se ejecutara antes de guardar en la base de datos 
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified("password")) { //isModified es un metodo de mongoose para evaluar si se modifico algo en el modelo
        next(); //se usa para pasar al siguiente middleware (en este caso no se ejecutara el codigo de hasheo de abajo)
    }
    const salt = await bcrypt.genSalt(10); //rondas de hasheo
    this.password = await bcrypt.hash(this.password, salt); //this hace referencia al objeto del modelo y hash guarda la contraseña ya hasheada
});

//se agrega esta funcion al modelo ara usarse en usuarioController, compara las contraseñas al autenticar al usuario
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Usuario = mongoose.model("Usuario",usuarioSchema);

export default Usuario
