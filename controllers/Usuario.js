const { Usuario } = require('../BD/bd');
const traerTodosLosUsuarios = async () => await Usuario.findAll();
const traerUsuario = async (userid) => await Usuario.findOne({ where: { ID: userid } });

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
const getUsuario = async(req, res)=>{
    const userid = req.params.id;   
    try {
        const usuario = await traerUsuario(userid);
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
    
}


module.exports = {
    getUsuarios,
    getUsuario
};