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
                trustServerCertificate: true
            }
        },
        logging: false,
    });

const UsuarioModel = require('./Model/Usuario');
const ProyectoModel = require('./Model/Proyecto');
const UsuarioProyectoModel = require('./Model/UsuariosProyecto');
const GastoModel = require('./Model/Gasto');
const DeudaModelo = require('./Model/Deuda');

const Proyecto = ProyectoModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const UsuarioProyecto = UsuarioProyectoModel(sequelize, Sequelize);
const Gastos = GastoModel(sequelize, Sequelize);
const Deudas = DeudaModelo(sequelize, Sequelize);


Usuario.hasMany(Proyecto, {
    foreignkey: 'usuarioAdmin',
    as: 'Proyectos administrados',
    onDelete: 'CASCADE'
});

Proyecto.belongsTo(Usuario, {
    foreignkey: 'usuarioAdmin',
    as: 'administrador'
});

//          Relaciones con la tabla de Usuario Proyecto          //
Usuario.belongsToMany(Proyecto, { through: UsuarioProyecto });
Proyecto.belongsToMany(Usuario, { through: UsuarioProyecto });

//          Relaciones con la tabla de gastos           //
Usuario.hasMany(Gastos, { foreignKey: 'usuarioID', as: 'Gastos' });
Proyecto.hasMany(Gastos, { foreignKey: 'proyectoID', as: 'Gastos' });
Gastos.belongsTo(Usuario, { foreignKey: 'usuarioID', as: 'Usuario' });
Gastos.belongsTo(Proyecto, { foreignKey: 'proyectoID', as: 'Proyecto' });
Gastos.hasMany(Deudas, {foreignKey: 'gastoID', as: 'deudasGeneradas' });

//          Relaciones con la tabla de Deudas           //
Proyecto.hasMany(Deudas, { foreignKey: 'proyectoId', as: 'deudas' });
Deudas.belongsTo(Proyecto, { foreignKey: 'proyectoId', as: 'proyecto' });
Usuario.hasMany(Deudas, { foreignKey: 'deudorId', as: 'deudasComoDeudor' });
Deudas.belongsTo(Usuario, { foreignKey: 'deudorId', as: 'deudor' });
Usuario.hasMany(Deudas, { foreignKey: 'cobradorId', as: 'deudasComoCobrador' });
Deudas.belongsTo(Usuario, { foreignKey: 'cobradorId', as: 'cobrador' });
Deudas.belongsTo(Gastos, {foreignKey: 'gastoID', as: 'gastoRelacionado' });

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
    UsuarioProyecto,
    Gastos,
    Deudas
};