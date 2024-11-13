const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Gasto = sequelize.define('Gasto', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        monto: {
            type: DataTypes.DECIMAL(15, 3),
            allowNull: false,
        },
    });

    return Gasto;
};