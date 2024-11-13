const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Gastos = sequelize.define('Gastos', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        monto: {
            type: DataTypes.DECIMAL(15, 3),
            allowNull: false,
        },
        imagen: DataTypes.STRING,
    });

    return Gastos;
};