const { Usuario } = require('../BD/bd');
const traerTodosLosUsuarios = async () => await Usuario.findAll();

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await traerTodosLosUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}


module.exports = {
    getUsuarios,
};