import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js';
import Usuario from '../models/Usuario.js';

const obtenerProyectos = async (req,res) => {
    const proyectos = await Proyecto.find({
        //esto evalua que proyectos se mostraran dependiendo si es colaborador o creador
        $or: [
            { colaboradores: { $in: [req.usuario] } }, //busca dentro de colaboradores si hay un valor igual a req.usuario
            { creador: { $in: [req.usuario] } }
        ]
    })
    // .where("creador")
    // .equals(req.usuario) //consulta con condiciones
    res.json(proyectos)
};

const nuevoProyecto = async (req,res) => {
    console.log(req.body);
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
};

const obtenerProyecto = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id).populate("colaboradores", "nombre email"); //solo se va a traer el nombre y el email

    if (!proyecto) {
        const error = new Error(" proyecto no encontrado");
        return res.status(404).json({msg: error.message})
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString() && proyecto.colaboradores.some(i=>i._id.toString() !== req.usuario._id.toString()) ) { //el some se utiliza para buscar y comparar dentro de un arreglo de objetos 
        const error = new Error("accion no valida");
        return res.status(401).json({msg: error.message})
    }

    //obtener las tareas del proyecto
    const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)

    res.json({
        proyecto,
        tareas,
    })
};

const editarProyectos = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id)

    if (!proyecto) {
        const error = new Error(" proyecto no encontrado");
        return res.status(404).json({msg: error.message})
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("accion no valida");
        return res.status(401).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }

};

const eliminarProyecto = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id)

    if (!proyecto) {
        const error = new Error(" proyecto no encontrado");
        return res.status(404).json({msg: error.message})
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("accion no valida");
        return res.status(401).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne();
        res.json({msg: "proyecto eliminado"})
    } catch (error) {
        console.log(error);
    }
};

const agregarColaborador = async (req,res) => {
    const {proyecto} = req.body;

    const existeProyecto = await Proyecto.findById(proyecto)

    if(!existeProyecto){
        const error = new Error("el proyecto no existe");
        return res.status(404).json({msg: error.message})
    }
    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("no tienes los permisos");
        return res.status(403).json({msg: error.message})
    }

    const {email} = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')
    if (!usuario) {
        const error =  new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    } 

    //revisar que el colaborador no es el admin del proyecto
    if(existeProyecto.creador.toString() == usuario._id.toString()){
        const error = new Error("el creador del proyecto no puede ser colaborador");
        return res.status(404).json({msg: error.message})
    }

    //revisar que no este agregado ya al proyecto
    if (existeProyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("el usuario ya pertenece al proyecto");
        return res.status(404).json({msg: error.message})
    }

    //esta bien, se puede agregar
    existeProyecto.colaboradores.push(usuario._id);
    await existeProyecto.save()
    res.json({msg: 'colaborador agregado correctamente'})
};

const buscarColaborador = async (req,res) => {
    const {email} = req.body
    console.log(req.body);
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')
    if (!usuario) {
        const error =  new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    } 

    res.json(usuario)
};

const eliminarColaborador = async (req,res) => {
    const {proyecto} = req.body;

    const existeProyecto = await Proyecto.findById(proyecto)

    if(!existeProyecto){
        const error = new Error("el proyecto no existe");
        return res.status(404).json({msg: error.message})
    }
    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("no tienes los permisos");
        return res.status(403).json({msg: error.message})
    }

    //esta bien, se puede eliminar
    existeProyecto.colaboradores.pull(req.body.id);
    await existeProyecto.save()
    res.json({msg: 'colaborador eliminado correctamente'})

    
};



export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyectos,
    eliminarProyecto,
    agregarColaborador,
    buscarColaborador,
    eliminarColaborador,
}