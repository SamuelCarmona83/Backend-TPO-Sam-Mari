const { Deudas } = require('../BD/bd');
const {traerUsuario} = require('../controllers/UsuarioControlador');
const {traerProyecto} = require('../controllers/ProyectoControlador');
const { Gastos } = require('../BD/bd');
const traerGasto = async (gastoID) => await Gastos.findByPk(gastoID);

const crearDeuda = async (req, res) => {
    const {monto, porcentaje, gastoID, proyectoId, deudorId, cobradorId} = req.body;

    try {
        if (isNaN(deudorId) ||isNaN(cobradorId) || isNaN(proyectoId)) {
            return res.status(400).json({ mensaje: "deudorId, cobradorId y proyectoId deben ser números válidos" });
        }
        const gasto = await traerGasto(gastoID);
        if (!gasto) {
            return res.status(404).json({ mensaje: "El gasto no existe" });
        }
        const deudor = await traerUsuario(deudorId);
        if (!deudor) {
            return res.status(404).json({ mensaje: "El deudor no existe" });
        }
        const cobrador = await traerUsuario(cobradorId);
        if (!cobrador) {
            return res.status(404).json({ mensaje: "El cobrador no existe" });
        }
        const proyecto = await traerProyecto(proyectoId);
        if (!proyecto) {
            return res.status(404).json({ mensaje: "El proyecto no existe" });
        }

        const montoDecimal = parseFloat(monto);
        if (isNaN(montoDecimal) || montoDecimal <= 0) {
            return res.status(400).json({ mensaje: "monto debe ser un número válido mayor a 0" });
        }

        await Deudas.create({
            monto: montoDecimal,
            porcentaje,
            imagen: "",
            gastoID,
            proyectoId,
            deudorId,
            cobradorId
        });

        res.status(200).json({mensaje: "Se creo correctamente la deuda"});
    } catch (error){
        res.status(500).json({
            mensaje: "Error al registrar la Deuda " + error.message,
        });
    }
}

const eliminarDeudasDeUnGasto = async (gastoID) => {

    try {
        const deudas = await Deudas.findAll({where:{gastoID: gastoID}});

        if (deudas.length === 0) {
            return { mensaje: "No se encontraron deudas asociadas a este gasto." };
        }

        for (const deuda of deudas) {
            await deuda.destroy();
        }

        return { mensaje: "Todas las deudas asociadas al gasto han sido eliminadas correctamente." };
    
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar las deudas: " + error.message,
        });
    }
}

const eliminarDeuda = async (req, res) => {
    const deudaID = Number(req.params.deudaID || req.query.deudaID);

    try {
        if (isNaN(deudaID)) {
            return res.status(400).json({ mensaje: "deudaID debe ser un número válido" });
        }

        const deuda = await Deudas.findByPk(deudaID);
        if (!deuda) {
            return res.status(404).json({ mensaje: "La deuda no existe" });
        }

        await deuda.destroy();
        res.status(200).json({ mensaje: "Deuda eliminada con éxito" });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la deuda: " + error.message,
        });
    }
};

const actualizarImagenDeDeuda = async (req, res) => {
    const deudaID = Number(req.params.deudaID || req.query.deudaID);
    const { nuevaImagen } = req.body;

    try {
        if (isNaN(deudaID)) {
            return res.status(400).json({ mensaje: "deudaID debe ser un número válido" });
        }

        const deuda = await Deudas.findByPk(deudaID);
        if (!deuda) {
            return res.status(404).json({ mensaje: "La deuda no existe" });
        }

        deuda.imagen = nuevaImagen || "";
        await deuda.save();
        res.status(200).json({ mensaje: "Imagen actualizada con éxito", deuda });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la imagen de la deuda: " + error.message,
        });
    }
};

const obtenerDeudasEntreUsuarios = async (req, res) => {
    const { deudorId, cobradorId, proyectoId } = req.body;

    try {
        if (isNaN(deudorId) || isNaN(cobradorId) || isNaN(proyectoId)) {
            return res.status(400).json({ mensaje: "deudorId, cobradorId y proyectoId deben ser números válidos" });
        }

        const deudas = await Deudas.findAll({
            where: {
                deudorId: Number(deudorId),
                cobradorId: Number(cobradorId),
                proyectoId: Number(proyectoId),
            },
        });

        if (deudas.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron deudas para los usuarios y proyecto especificados" });
        }

        res.status(200).json(deudas);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las deudas: " + error.message,
        });
    }
};

const marcarDeudaComoPagada = async (req, res) => {
    const deudaID = Number(req.params.deudaID || req.query.deudaID);

    try {
        if (isNaN(deudaID)) {
            return res.status(400).json({ mensaje: "deudaID debe ser un número válido" });
        }

        const deuda = await Deudas.findByPk(deudaID);
        if (!deuda) {
            return res.status(404).json({ mensaje: "La deuda no existe" });
        }

        if (deuda.pagada) {
            return res.status(400).json({ mensaje: "La deuda ya está marcada como pagada" });
        }

        deuda.pagada = true;
        await deuda.save();

        res.status(200).json({ mensaje: "Deuda marcada como pagada con éxito", deuda });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al marcar la deuda como pagada: " + error.message,
        });
    }
};

const obtenerDeudasUsuarioPorProyecto = async (req, res) => {
    const proyectoId = Number(req.params.proyectoId);
    const usuarioId = Number(req.params.usuarioId);

    try {
        if (isNaN(usuarioId) || isNaN(proyectoId)) {
            return res.status(400).json({ mensaje: "deudorId y proyectoId deben ser números válidos" });
        }


        const deudas = await Deudas.findAll({
            where: {
                deudorId: Number(usuarioId),
                proyectoId: Number(proyectoId),
            },
        });

        res.status(200).json(deudas);
    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener las deudas: " + error.message,
        });
    }
};

const obtenerDeudasPorProyecto = async (req, res) => {
    const proyectoId = Number(req.params.proyectoId);

    try {
        if (isNaN(proyectoId)) {
            return res.status(400).json({ mensaje: "proyectoId debe ser un número válido" });
        }

        // Buscar todas las deudas relacionadas con el proyecto
        const deudas = await Deudas.findAll({
            where: {
                proyectoId: Number(proyectoId),
            },
        });

        if (deudas.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron deudas para el proyecto especificado" });
        }

        res.status(200).json(deudas);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las deudas del proyecto: " + error.message,
        });
    }
};


module.exports = {
    crearDeuda,
    eliminarDeudasDeUnGasto,
    eliminarDeuda,
    actualizarImagenDeDeuda,
    obtenerDeudasEntreUsuarios,
    marcarDeudaComoPagada,
    obtenerDeudasUsuarioPorProyecto,
    obtenerDeudasPorProyecto
};