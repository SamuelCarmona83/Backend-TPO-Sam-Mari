const { Proyecto, UsuarioProyecto, Deudas, Gastos, Usuario} = require('../BD/bd');
const { Op } = require('sequelize');
const {traerUsuario} = require('../controllers/UsuarioControlador');
const { json } = require('express');
const Gasto = require('../BD/Model/Gasto');
const Deuda = require('../BD/Model/Deuda');
const proyectosDelUsuario = async (UsuarioID) => await UsuarioProyecto.findAll({where:{UsuarioID: UsuarioID}});
const traerProyecto = async (proyectoID) => await Proyecto.findOne({ where: { ID: proyectoID } });

const getProyectos = async (req, res) => {
    const UsuarioID = Number(req.query.usuarioId || req.params.usuarioId);
    try {
        const proyectos = await AuxTraerProyectos(UsuarioID);
        res.status(200).json(proyectos);        
    } catch (err) {
        res.status(500).json({
            mensaje: err.message
        });
        console.log("### ERROR ### EN EL TRY DE GETPROYECTOS:  " + err.message);
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

        res.status(200).json({
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
        await Deudas.destroy({ where: { proyectoId } });
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
// Refactoring para utilizar menos llamadas en el front //

const AuxTraerProyectos = async (usuarioID) => {
    const proyectosID = await proyectosDelUsuario(usuarioID);
    const ids = proyectosID.map(proyecto => proyecto.ProyectoID);
    const proyectos = await Proyecto.findAll({
        where: {
            ID: {
                [Op.in]: ids // Filtrar proyectos con IDs en la lista
            }
        }
    });

    const gastosDelProyecto = await Gastos.findAll({
        where: {
            proyectoID: {
                [Op.in]: ids 
            }
        }
    });

    const deudasDelProyecto = await Deudas.findAll({
        where: {
            proyectoId: {
                [Op.in]: ids 
            }
        }
    });

    const relacionesUsuarioProyecto = await UsuarioProyecto.findAll({
        where: {
            ProyectoID: {
                [Op.in]: ids 
            }
        },
        attributes: ['UsuarioID', 'ProyectoID'] // Limita los atributos a los necesarios
    });


    const usuariosIDs = [...new Set(relacionesUsuarioProyecto.map(rel => rel.UsuarioID))];
    const usuarios = await Usuario.findAll({
        where: {
            ID: {
                [Op.in]: usuariosIDs
            }
        }
    });

    const respuesta = proyectos.map(proyecto => {
        // Filtra las relaciones correspondientes a este proyecto
        const usuariosRelacionados = relacionesUsuarioProyecto
            .filter(rel => rel.ProyectoID === proyecto.ID)
            .map(rel => usuarios.find(usuario => usuario.ID === rel.UsuarioID)); // Asocia los usuarios
        
        const gastosRelacionados = gastosDelProyecto.filter(gasto => gasto.proyectoID === proyecto.ID);

        const deudasRelacionadas = deudasDelProyecto.filter(deuda => deuda.proyectoId === proyecto.ID);

        return {
            ...proyecto.toJSON(), // Copia los datos del proyecto
            usuarios: usuariosRelacionados, // Agrega los usuarios relacionados
            gastos: gastosRelacionados, // Agrega los gastos relacionados
            deudas: deudasRelacionadas // Agrega las deudas relacionadas
        };
    });

    return respuesta; // Devuelve la lista de proyectos con usuarios
};


module.exports = {
    getProyectos,
    getProyecto,
    crearProyecto,  
    editarProyecto,
    eliminarProyecto,
    participantesDelProyecto,
    agregarParticipante,
    traerProyecto
};