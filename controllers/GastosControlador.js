const { Gastos } = require('../BD/bd');
const { Op } = require('sequelize');
const {traerUsuario} = require('../controllers/UsuarioControlador');
const {traerProyecto} = require('../controllers/ProyectoControlador');
const jwt = require('jsonwebtoken');

const crearGasto = async (req,res) => {
    const {monto, imagen, usuarioID, proyectoID} = req.body;

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
        const nuevoGasto = {
            monto: montoDecimal,
            imagen,
            usuarioID,
            proyectoID,
        };
        await Gastos.create(nuevoGasto);


    } catch (error){
        res.status(500).json({
            mensaje: "Error al registrar el gasto " + error.message,
        });
    }
}

const eliminarGasto = async (req, res) => {
    const gastoID = Number(req.params.id || req.query.id);

    try {
        if (isNaN(gastoID)) {
            return res.status(400).json({ mensaje: "gastoID debe ser un número válido" });
        }

        const gasto = await Gastos.findByPk(gastoID);
        if (!gasto) {
            return res.status(404).json({ mensaje: "El gasto no existe" });
        }

        await Gastos.destroy({ where: { id: gastoID } });
        res.status(200).json({ mensaje: "Gasto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el gasto: " + error.message,
        });
    }
};

const obtenerGastosDelUsuarioPorProyecto = async (req, res) => {
    const proyectoID = Number(req.params.id || req.query.id);
    const token = req.headers.jwt;

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado: No se proporcionó un token" });
    }
    try {
        const dataToken = jwt.verify(token, process.env.KEY);
        const usuarioID = dataToken.id;

        if (isNaN(usuarioID) || isNaN(proyectoID)) {
            return res.status(400).json({ mensaje: "usuarioID y proyectoID deben ser números válidos" });
        }

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

module.exports = {
    crearGasto,
    eliminarGasto,
    obtenerGastosDelUsuarioPorProyecto
};