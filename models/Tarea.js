import mongoose from "mongoose";

const tareasSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    estado: {
        type: Boolean,
        default: false,
    },
    fechaEntrega: {
        type: Date,
        required: true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        required: true,
        enum: ['Baja', 'Media', 'Alta'] //el enum solo permite los valores que estan mecionados
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto",
    },
}, {
    timestamps: true
});

const Tarea = mongoose.model('Tarea', tareasSchema)

export default Tarea