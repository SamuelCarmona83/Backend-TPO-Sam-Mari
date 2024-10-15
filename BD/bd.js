const { Sequelize } = require('sequelize');

// conectar la base de datos //
const sequelize = new Sequelize(
    'Backend_TPO_Mari_Sam',
    'marisa',
    'admin', 
    {
        host: 'localhost',  // Cambia 'localhost' si tu servidor no está en la misma máquina
        dialect: 'mssql',   // Cambia de 'mysql' a 'mssql' para usar SQL Server
    }
);