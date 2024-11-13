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
const GastoModel = require('./Model/Gasto');

const Proyecto = ProyectoModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const UsuarioProyecto = UsuarioProyectoModel(sequelize, Sequelize);
const gasto = GastoModel(sequelize, Sequelize)

Usuario.hasMany(Proyecto, {
    foreignkey: 'usuarioAdmin',
    as: 'Proyectos administrados',
    onDelete: 'CASCADE'
});

Proyecto.belongsTo(Usuario, {
    foreignkey: 'usuarioAdmin',
    as: 'administrador'
});

//      Relaciones con la tabla de Usuario Proyecto     //
Usuario.belongsToMany(Proyecto, { through: UsuarioProyecto });
Proyecto.belongsToMany(Usuario, { through: UsuarioProyecto });

//          Relaciones con la tabla de gastos           //
Usuario.hasMany(Gasto, { foreignKey: 'usuarioID', as: 'Gastos' });
Proyecto.hasMany(Gasto, { foreignKey: 'proyectoID', as: 'Gastos' });
Gasto.belongsTo(Usuario, { foreignKey: 'usuarioID', as: 'Usuario' });
Gasto.belongsTo(Proyecto, { foreignKey: 'proyectoID', as: 'Proyecto' });

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