const { Proyecto, UsuarioProyecto } = require('../BD/bd');
const traerTodosLosProyectos = async () => await Proyecto.findAll();
const traerProyecto = async (proyecid) => await Proyecto.findOne({ where: { ID: proyecid } });

const getProyectos = async (req, res) => {
    try {
        const proyectos = await traerTodosLosProyectos();
        res.status(200).json(proyectos);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getProyecto = async(req, res)=>{
    const proyecid = req.params.id;   
    try {
        const proyecto = await traerProyecto(proyecid);
        res.status(200).json(proyecto);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
    
}

const crearProyecto = async(req,res)=>{
    const {nombre, usuarioAdmin} = req.body;
    console.log(nombre, usuarioAdmin);

    try {
        const proyectoExistente = await Proyecto.findOne({where: {nombre}});
        if (proyectoExistente) {
            return res.status(400).json({mensaje: "El proyecto ya Existe"})
        }
        if (isNaN(usuarioAdmin)) {
            return res.status(400).json({ mensaje: "usuarioAdmin debe ser un número válido" });
        }

        const nuevoProyecto = await Proyecto.create({nombre: nombre, usuarioAdmin: usuarioAdmin, descripcion: "Nuevo Proyecto",})
        const nuevoParticipante = await UsuarioProyecto.create({UsuarioID: usuarioAdmin, ProyectoID: nuevoProyecto.ID });

        res.status(201).json({
            mensaje: "Se creo el proyecto "
        })

    } catch (error) {
        console.error('Error al registrar el proyecto:', error.parent ? error.parent : error);
        res.status(500).json({ error: 'Error al registrar el proyecto' });
    }
}   

const editarDescripcion = async(req,res)=>{
    const proyectoId = req.params.id; 
    const {descripcion} = req.body;

    try {
        const proyecto = await traerProyecto(proyectoId);
        if (!proyecto){
            return res.status(400).json(
                {mensaje: 'proyecto no encontrado'}
            )
        }

        proyecto.descripcion = descripcion;
        await proyecto.save();

    }catch(error){
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    getProyectos,
    getProyecto,
    crearProyecto,
    editarDescripcion
};