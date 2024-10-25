const { Proyecto } = require('../BD/bd');
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


module.exports = {
    getProyectos,
    getProyecto
};