const { where, Op} = require('sequelize');
const { Deudas } = require('../db/bd');
const { pagarDeudaPorID, cambiarMontoPorID } = require('./DeudaServicio');
require('dotenv').config();

const crearDeudaPorNuevoGasto = async (gasto, deudasDelUsuarioCobrador, porcentaje, participanteID) => {
    const montoDeuda = gasto.monto * parseFloat(porcentaje);
    const deudasFiltradas = deudasDelUsuarioCobrador.filter((deuda) => {
        return deuda.cobradorId === Number(participanteID);
    });

    if (deudasFiltradas.length > 0){
        let totalCompensadoPorDeudas = 0;
        let deudasSaldadasParaCompensar = [];
        let diferencia;

        for(let deuda of deudasFiltradas){
            if(totalCompensadoPorDeudas === 0){
                deudasSaldadasParaCompensar.push(deuda);
                totalCompensadoPorDeudas += deuda.monto;
                diferencia = montoDeuda - totalCompensadoPorDeudas;
            }else {
                if (diferencia > 0 ){
                    deudasSaldadasParaCompensar.push(deuda);
                    totalCompensadoPorDeudas += deuda.monto;
                    diferencia = montoDeuda - totalCompensadoPorDeudas;
                }else{
                    break
                }
            }
        }

        if(diferencia > 0){
            for(let deuda of deudasSaldadasParaCompensar){
                await pagarDeudaPorID(deuda.ID);
            }
            await crearDeudaSimple(diferencia, Number(porcentaje), gasto.ID, Number(gasto.proyectoID), Number(participanteID), Number(gasto.usuarioID));
        }else if(diferencia === 0){
            for(let deuda of deudasSaldadasParaCompensar){
                await pagarDeudaPorID(deuda.ID);
            }
        }else {
            let flag = true;
            for(let deuda of deudasSaldadasParaCompensar){
                if (flag && deuda.monto > diferencia){
                    flag = false;
                    await cambiarMontoPorID(deuda.ID, deuda.monto - diferencia);
                }else {
                    await pagarDeudaPorID(deuda.ID);
                }
            }
        }

    } else {
        await crearDeudaSimple(montoDeuda, Number(porcentaje), gasto.ID, Number(gasto.proyectoID), Number(participanteID), Number(gasto.usuarioID));
    }
}

const crearDeudaSimple = async (monto, porcentaje, gastoID, proyectoId, deudorId, cobradorId) => {
    try{
        await Deudas.create({
            monto,
            porcentaje,
            imagen: "",
            gastoID,
            proyectoId,
            deudorId,
            cobradorId,
        });
    }catch(error){
        console.log("### ERROR ###");
        console.log("### En el try de crearDeudaSimple servicios/Fabrica.js###");
    }
}

module.exports = {
    crearDeudaPorNuevoGasto
}