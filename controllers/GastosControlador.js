const { Gastos, Deudas } = require('../db/bd');
const {traerUsuario} = require('./UsuarioControlador');
const {traerProyecto} = require('./ProyectoControlador');
const {eliminarDeudasDeUnGasto} = require('./DeudaControlador')
const jwt = require('jsonwebtoken');
const { crearDeudaPorNuevoGasto } = require('../servicios/Fabrica');

const crearGasto = async (req,res) => {
    const {monto, imagen, descripcion, usuarioID, proyectoID, participantes} = req.body;

    try {
        if (isNaN(usuarioID)) {
            return res.status(400).json({ mensaje: "usuarioID debe ser un número válido" });
        }
        if (isNaN(proyectoID)) {
            return res.status(400).json({ mensaje: "proyectoID debe ser un número válido" });
        }
        const usuario = await traerUsuario(usuarioID);
        if(!usuario){
            return res.status(400).json({mensaje: "El Usuario no existe"});
        }
        const proyecto = await traerProyecto(proyectoID);
        if(!proyecto){
            return res.status(400).json({mensaje: "El Proyecto no existe"});
        }
        const montoDecimal = parseFloat(monto);
        if (isNaN(montoDecimal) || montoDecimal <= 0) {
            return res.status(400).json({ mensaje: "monto debe ser un número válido mayor a 0" });
        }

        let nuevoGasto = await Gastos.create({
            monto: montoDecimal,
            imagen,
            descripcion,
            usuarioID,
            proyectoID,
        });

        let deudasDelUsuario = await Deudas.findAll({
            where:{
                proyectoId: proyectoID,
                deudorId: usuarioID,
            },
            order: [['monto', 'DESC']],
        });

        for(let participante of participantes){
            await crearDeudaPorNuevoGasto(nuevoGasto, deudasDelUsuario, participante.porcentaje, participante.ID);
        }


        res.status(200).json({mensaje: "Se creo correctamente el gasto"});
    } catch (error){
        res.status(500).json({
            mensaje: "Error al registrar el gasto " + error.message,
        });
    }
}

const eliminarGasto = async (req, res) => {
    const gastoID = Number(req.params.gastoID || req.query.gastoID);

    try {
        if (isNaN(gastoID)) {
            return res.status(400).json({ mensaje: "gastoID debe ser un número válido" });
        }

        const gasto = await Gastos.findByPk(gastoID);
        if (!gasto) {
            return res.status(404).json({ mensaje: "El gasto no existe" });
        }
        await eliminarDeudasDeUnGasto(gastoID);
        await Gastos.destroy({ where: { id: gastoID } });
        res.status(200).json({ mensaje: "Gasto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el gasto: " + error.message,
        });
    }
};

const obtenerGastosDelUsuarioPorProyecto = async (req, res) => {
    const proyectoID = Number(req.params.proyectoID);
    const usuarioID = Number(req.params.usuarioID);

    try {
        const usuario = await traerUsuario(usuarioID);
        if (!usuario) {
            return res.status(404).json({ mensaje: "El Usuario no existe" });
        }
        const proyecto = await traerProyecto(proyectoID);
        if (!proyecto) {
            return res.status(404).json({ mensaje: "El Proyecto no existe" });
        }

        const gastos = await Gastos.findAll({
            where: {
                usuarioID,
                proyectoID,
            },
        });
        res.status(200).json(gastos);
    } catch (error) {
        res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
}

const obtenerGastosPorProyecto = async (req, res) => {
    const proyectoID = Number(req.params.proyectoID || req.query.proyectoID);

    try {
        if (isNaN(proyectoID)) {
            return res.status(400).json({ mensaje: "proyectoID debe ser un número válido" });
        }

        const proyecto = await traerProyecto(proyectoID);
        if (!proyecto) {
            return res.status(404).json({ mensaje: "El Proyecto no existe" });
        }

        const gastos = await Gastos.findAll({
            where: {
                proyectoID,
            },
        });

        res.status(200).json(gastos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los gastos del proyecto: " + error.message,
        });
    }
};


module.exports = {
    crearGasto,
    eliminarGasto,
    obtenerGastosDelUsuarioPorProyecto,
    obtenerGastosPorProyecto
};