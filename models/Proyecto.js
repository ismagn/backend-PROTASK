import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),
    },
    cliente: {
        type: String,
        trim: true,
        required: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,  //esto va hacer referencia con el modelo de usuarios, como si fuera relacional
        ref: 'Usuario',
    },
    colaboradores: [  //este va a ser una coleccion de usuarios y por eso se pone []
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        }
    ],
},
{
    timestamps: true,
}
);

const Proyecto = mongoose.model("Proyecto",proyectosSchema);

export default Proyecto;