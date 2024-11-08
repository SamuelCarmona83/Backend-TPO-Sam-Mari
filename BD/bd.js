const { Sequelize } = require('sequelize');

// conectar la base de datos //
const sequelize = new Sequelize(
    'Backend_TPO_Mari_Sam', //nombre de la base de datos
    'marisa', // usuario
    'admin', // contraseña
    {
        host: 'localhost',  // Cambia 'localhost' si tu servidor no está en la misma máquina
        dialect: 'mssql',
        port: 1434,
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true // Esto desactiva la validación del certificado SSL
            }
        },
        logging: false,
    });

const UsuarioModel = require('./Model/Usuario');
const ProyectoModel = require('./Model/Proyecto');
const UsuarioProyectoModel = require('./Model/UsuariosProyecto');

const Proyecto = ProyectoModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const UsuarioProyecto = UsuarioProyectoModel(sequelize, Sequelize);

Usuario.hasMany(Proyecto, {
    foreignkey: 'usuarioAdmin',
    as: 'Proyectos administrados',
    onDelete: 'CASCADE'
});

Proyecto.belongsTo({
    foreignkey: 'usuarioAdmin',
    as: 'administrador'
});

Usuario.belongsToMany(Proyecto, { through: UsuarioProyecto });
Proyecto.belongsToMany(Usuario, { through: UsuarioProyecto });

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.log('Error: ', err);
    });

module.exports = {
    sequelize,
    Usuario,
    Proyecto,
    UsuarioProyecto
};