import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";


const agregarTarea = async (req,res) => {
    const {proyecto} = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if(!existeProyecto){
        const error = new Error("el proyecto no existe");
        return res.status(404).json({msg: error.message})
    }
    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("no tienes los permisos para añadir tareas");
        return res.status(403).json({msg: error.message})
    }

    try {
        //otra forma de crear un nuevo registro sin poner const tarea = new Tarea(req.body)
        const tareaAlmacenada = await Tarea.create(req.body)
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }
};

const obtenerTarea = async (req,res) => {
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");  //populate realiza otra consulta dentro de la primera consulta, en este caso consulta el "proyecto" el cual tiene otras propiedades dentro

    if (!tarea) {
        const error = new Error("tarea no encontrada");
        return res.status(404).json({msg: error.message})
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && tarea.proyecto.colaboradores.some(i=>i._id.toString() !== req.usuario._id.toString())) {
        const error = new Error("accion no valida");
        return res.status(403).json({msg: error.message})
    }
    

    res.json(tarea)
};

const actualizarTarea = async (req,res) => {
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");  //populate realiza otra consulta dentro de la primera consulta, en este caso consulta el "proyecto" el cual tiene otras propiedades dentro
    
    if (!tarea) {
        const error = new Error("tarea no encontrada");
        return res.status(404).json({msg: error.message})
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error(" accion no valida");
        return res.status(403).json({msg: error.message})
    }

    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
    tarea.estado = req.body.estado || tarea.estado

    try {
        const tareaAlmacenada = await tarea.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }

};

const eliminarTarea = async (req,res) => {
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");  //populate realiza otra consulta dentro de la primera consulta, en este caso consulta el "proyecto" el cual tiene otras propiedades dentro

    if (!tarea) {
        const error = new Error("tarea no encontrada");
        return res.status(404).json({msg: error.message})
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("tarea no accion no valida");
        return res.status(403).json({msg: error.message})
    }

    try {
        await tarea.deleteOne();
        res.json({msg: "tarea eliminada"})
    } catch (error) {
        console.log(error);
    }
};

const cambiarEstado = async (req,res) => {
    const {id} = req.params;
    const {idProyecto} = req.body
    //const tarea = await Tarea.findByIdAndUpdate(id,{estado: estado }); 
    const tarea = await Tarea.findById(id).populate("proyecto");

    console.log(tarea);

    if (!tarea) {
        const error = new Error("tarea no encontrada");
        return res.status(404).json({msg: error.message})
    }

     if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && tarea.proyecto.colaboradores.some(i=>i._id.toString() !== req.usuario._id.toString()) ) { //el some se utiliza para buscar y comparar dentro de un arreglo de objetos 
        const error = new Error("accion no valida");
        return res.status(401).json({msg: error.message})
    }

    if (tarea.estado) {
        tarea.estado = false
        tarea.save()
    } else {
        tarea.estado = true
        tarea.save()
    }
    
};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}