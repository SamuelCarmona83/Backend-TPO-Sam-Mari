const { where } = require('sequelize');
const { Deudas } = require('../BD/bd');

const pagarDeudaPorID = async (deudaID) => {
    try{
        let deuda = await Deudas.findByPk(deudaID);
        if(deuda){
            deuda.pagada = true;
            await deuda.save();
        }else {
            console.log("No se encontro la deuda, deudaID: " + deudaID);
        }
    }catch(error){
        console.log("### ERROR ###");
        console.log("### En el try de pagarDeudaPorID => servicios/DeudaServicio.js ###");
    }
}

const cambiarMontoPorID = async (deudaID, nuevoMonto) => {
    try{
        let deuda = await Deudas.findByPk(deudaID);
        if(deuda){
            deuda.monto = nuevoMonto;
            await deuda.save();
        }else {
            console.log("No se encontro la deuda, deudaID: " + deudaID);
        }
    }catch(error){
        console.log("### ERROR ###");
        console.log("### En el try de cambiarMontoPorID => servicios/DeudaServicio.js ###");
    }
}

module.exports = {
    pagarDeudaPorID,
    cambiarMontoPorID
}