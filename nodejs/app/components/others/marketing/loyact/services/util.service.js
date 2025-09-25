const { Op } = require("sequelize");
const { CLIENT_CONFIG } = require("../../../../../config/environments/mysql/environment");
const { ErrorCode } = require("../../../../../helpers/error");
const { verifierExistence, isNumber } = require("../../../../../helpers/helpers.helper")
const { clientVip: ClientVip, Loyact, HistoriquePointVip, ParamNumClient } = require("../../../../../models");
const { findExistingNumero } = require("../../../../../services/gifi/client-vip/utils/num-client.service");
const { LOYACT_ORIGIN, BLOCKING_CAUSE, TRANSFERT_CAUSE } = require("./constant");
const { addPointLoyactWithTest } = require("./point.service");

async function verifyClientAndPoints(noCarte, points, transaction){
    validatePoints(points);
    return await findAndVerifyClient(noCarte, transaction);
}

async function findAndVerifyClient(noCarte, transaction){
    return await verifierExistence(ClientVip, noCarte, "Carte", [], transaction, "numClient")
}

async function insertLoyact(loyact, clientVip, numticket, transaction, deactivate = false){
    await addPointLoyactWithTest(clientVip, loyact.nbPoints, numticket, transaction);
    await updateNumClient(loyact, clientVip, transaction);
    await deactivateClient(clientVip, deactivate, transaction);
    return await Loyact.create(loyact, { transaction });
}

async function updateNumClient(loyact, clientVip, transaction){
    if(loyact.newNoCarte){
        const data = { numClient: loyact.newNoCarte };
        await ClientVip.update(data, { where: {id: clientVip.id}, transaction });
        await updateHistoriquePointClient(data, clientVip, transaction);
        await updateDernierNumero(loyact.newNoCarte, transaction);
    }
}

async function updateHistoriquePointClient(data, clientVip, transaction){
    await HistoriquePointVip.update(data, {
        where: { numClient: clientVip.numClient },
        transaction
    })
}

async function updateDernierNumero(newNoCarte, transaction){
    const params = await findExistingNumero(transaction);
    if(parseInt(newNoCarte) > parseInt(params.currentNumero)){
        await ParamNumClient.update({currentNumero: newNoCarte}, 
            {
                where: {id: {[Op.not]: null}},
                transaction
            }
        );
    }
}

async function deactivateClient(clientVip, deactivate, transaction){
    if(deactivate){
        const data = { dateActivation: null };
        await ClientVip.update(data, { where: {id: clientVip.id}, transaction });
    }
}

function validatePoints(points){
    if(!isNumber(points))
        throw new ErrorCode("Points invalide");
}

function generateLoyact(client, nbPoints, action, cause, newNoCarte = null, optinFid = null){
    return {
        noCarte: client.numClient,
        date: new Date(),
        action,
        origine: LOYACT_ORIGIN.store,
        magasin: client.storeCode,
        codeEtab: CLIENT_CONFIG.etab,
        nbPoints,
        cause,
        newNoCarte,
        optinFid
    }
}

function verifyCause(causeObject, cause){
    for(const key in causeObject){
        if(causeObject[key] == cause)
            return;
    }
    throw new ErrorCode("Cause invalide");
}

function getBlockingCauses(){
    return [
        { label: "Perte", value: BLOCKING_CAUSE.loss },
        { label: "Vol", value: BLOCKING_CAUSE.theft },
        { label: "Demande du client", value: BLOCKING_CAUSE.customerRequest }
    ]
}

function getTransfertCauses(){
    return [
        { label: "Perte", value: TRANSFERT_CAUSE.loss },
        { label: "Vol", value: TRANSFERT_CAUSE.theft },
        { label: "Demande du client", value: TRANSFERT_CAUSE.customerRequest }
    ]
}

module.exports = {
    findAndVerifyClient,
    insertLoyact,
    validatePoints,
    generateLoyact,
    verifyClientAndPoints,
    verifyCause,
    getBlockingCauses,
    getTransfertCauses
}