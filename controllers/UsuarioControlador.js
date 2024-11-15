const { where } = require('sequelize');
const { Usuario } = require('../BD/bd');
const traerTodosLosUsuarios = async () => await Usuario.findAll();
const traerUsuario = async (userid) => await Usuario.findOne({ where: { ID: userid } });

const getUsuarios = async (req, res) => {// esta creo que no deberia estar // borrar luego //
    try {
        const usuarios = await traerTodosLosUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getUsuariobyID = async(req, res)=>{
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

const loginUsuario = async(req, res) =>{
    const {email, clave} = req.body;

    try{
        const usuario = await Usuario.findOne({where: {email}});
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (clave != usuario.contraseña) {
            return res.status(401).json({ mensaje: 'Clave incorrecta' });
        }

        res.json({ mensaje: 'Inicio de sesión exitoso', usuario: usuario });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

const registrarUsuario = async(req, res) => {
    const {email, clave, nombre} = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
        }

        const nuevoUsuario = await Usuario.create({nombre: nombre, email: email, contraseña:clave, imagen: ""});

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente'
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
    
}

const modificarUsuario = async (req, res) => {// por ahora lo hare sin el tema de la imagen
    const {nombre, email, contraseña, ID} = req.body;

    try{
        const usuarioAModificar = traerUsuario(ID);
        if(!usuarioAModificar){
            return res.status(400).json({mensaje: "El usuario no existe"})
        }
        if(nombre){
            usuarioAModificar.nombre = nombre;
        }
        if(email){
            usuarioAModificar.email = email;
        }
        if(contraseña){
            usuarioAModificar.contraseña = contraseña;
        }
        res.status(200).json({mensaje: "Se modifico correctamente el usuario" + nombre});
    }catch(error){
        console.error('Error al modificar el usuario:', error);
        res.status(500).json({ error: 'Error al modificar el usuario' });
    }
}

module.exports = {
    getUsuarios,
    getUsuariobyID,
    loginUsuario,
    registrarUsuario,
    modificarUsuario
};