const { Proyecto, UsuarioProyecto } = require('../BD/bd');
const { Op } = require('sequelize');
const {traerUsuario} = require('../controllers/UsuarioControlador');
const proyectosDelUsuario = async (UsuarioID) => await UsuarioProyecto.findAll({where:{UsuarioID: UsuarioID}});
const traerProyecto = async (proyectoID) => await Proyecto.findOne({ where: { ID: proyectoID } });

const getProyectos = async (req, res) => {
    const UsuarioID = Number(req.query.usuarioId || req.params.usuarioId);
    console.log(UsuarioID);
    try {
        const proyectosID = await proyectosDelUsuario(UsuarioID);
        const ids = proyectosID.map(proyecto => proyecto.ProyectoID);

        // Realizas la consulta para obtener todos los proyectos cuyo ID esté en la lista
        const proyectos = await Proyecto.findAll({
            where: {
                ID: {
                    [Op.in]: ids // Busca proyectos cuyo ID esté en la lista de IDs
                }
            }
        });

        res.status(200).json(proyectos);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message
        });
    }
}

const getProyecto = async(req, res)=>{
    const proyectoid = Number(req.query.id || req.params.id);
    try {
        const proyecto = await traerProyecto(proyectoid);
        res.status(200).json(proyecto);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
    
}

const crearProyecto = async(req,res)=>{
    const {nombre, usuarioAdmin} = req.body;

    try {
        if (isNaN(usuarioAdmin)) {
            return res.status(400).json({ mensaje: "usuarioAdmin debe ser un número válido" });
        }
        const usuario = await traerUsuario(usuarioAdmin);
        if(!usuario){
            return res.status(400).json({ mensaje: "usuarioAdmin no existe" });
        }
        const nuevoProyecto = await Proyecto.create({nombre: nombre, usuarioAdmin: usuarioAdmin, descripcion: "Nuevo Proyecto",})
        await UsuarioProyecto.create({UsuarioID: usuarioAdmin, ProyectoID: nuevoProyecto.ID });

        res.status(201).json({
            mensaje: "Se creo el proyecto " + nuevoProyecto.nombre,
        });

    } catch (error) {
        console.error('Error al registrar el proyecto:', error.parent ? error.parent : error);
        res.status(500).json({ error: 'Error al registrar el proyecto' + error });
    }
}   

const editarProyecto = async(req,res)=>{
    const proyectoId = Number(req.query.id || req.params.id);
    const {nombre, descripcion} = req.body;

    try {
        const proyecto = await traerProyecto(proyectoId);
        if (!proyecto){
            return res.status(400).json(
                {mensaje: 'proyecto no encontrado'}
            )
        }

        if (nombre && typeof nombre === 'string') {
            proyecto.nombre = nombre;
        }
    
        if (descripcion && typeof descripcion === 'string') {
            proyecto.descripcion = descripcion;
        }

        await proyecto.save();
        res.status(200).json({mensaje: "Se modifico correctamente el proyecto "+ proyecto.nombre});

    }catch(error){
        res.status(500).json({
            message: err.message
        });
    }
}

const eliminarProyecto = async (req, res) => {
    const proyectoId = Number(req.query.id || req.params.id);
    try {
        const proyecto = await traerProyecto(proyectoId);
        if (!proyecto) {
            return res.status(404).json({ mensaje: "Proyecto no encontrado" });
        }
        // Eliminar las deudas relacionadas con el proyecto
        await deudas.destroy({ where: { proyectoId } });
        // Eliminar los gastos relacionados con el proyecto
        await Gastos.destroy({ where: { proyectoID: proyectoId } });
        // Eliminar las relaciones en UsuarioProyecto
        await UsuarioProyecto.destroy({ where: { ProyectoID: proyectoId } });
        await proyecto.destroy();
        res.status(200).json({ mensaje: "Proyecto eliminado exitosamente" });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error.parent ? error.parent : error);
        res.status(500).json({ mensaje: "Error al eliminar el proyecto" });
    }
};

const participantesDelProyecto = async (req, res) => {
    const proyectoId = Number(req.query.id || req.params.id);
    try {
        const proyecto = await traerProyecto(proyectoId);
        if (!proyecto) {
            return res.status(404).json({ mensaje: "Proyecto no encontrado" });
        }

        const participantes = await UsuarioProyecto.findAll({where: { ProyectoID: proyectoId } });
        res.status(200).json({participantes});
    }catch(error){
        res.status(500).json({
            mensaje: error.message
        });
    }

}

const agregarParticipante = async (req, res) => {
    const proyectoId = Number(req.query.id || req.params.id);
    const usuarioId = Number(req.body.usuarioId);
    const usuario = await traerUsuario(usuarioId);
    if(!usuarioId || !usuario){ // validando que mando un usuario valido a agregar//
        return res.status(400).json({
            mensaje: "No hay usuario a agregar"
        });
    }
    //validando si ya esta agregado//
    const participantes = await UsuarioProyecto.findAll({where: { ProyectoID: proyectoId } });
    let participanteEncontrado = false;
    participantes.map(participante => {
        if (participante.UsuarioID === usuarioId) {
            participanteEncontrado = true;
        }
    })
    console.log(participanteEncontrado);
    if(participanteEncontrado){
        return res.status(400).json({
            mensaje: "Ya esta agregado"
        });
    }
    try{
        const proyecto = await traerProyecto(proyectoId);
        if (!proyecto) {
            return res.status(404).json({ mensaje: "Proyecto no encontrado" });
        }

        await UsuarioProyecto.create({UsuarioID: usuarioId, ProyectoID: proyectoId});
        res.status(200).json({
            mensaje: "Se agrego correctamente el participante"
        })
    }catch (error){
        res.status(500).json({
            mensaje: error.message
        });
    }
}

module.exports = {
    getProyectos,
    getProyecto,
    crearProyecto,  
    editarProyecto,
    eliminarProyecto,
    participantesDelProyecto,
    agregarParticipante
};