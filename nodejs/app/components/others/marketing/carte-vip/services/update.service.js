const { ErrorCode } = require("../../../../../helpers/error");
const { verifierExistence } = require("../../../../../helpers/helpers.helper");
const { sequelize, clientVip: ClientVip } = require("../../../../../models");
const { insertHistoriquePoint } = require("./historique.service");
const { findExistParametrage } = require("./parametrage.service");
const { verifyTicketCaisse } = require("./verif.service");

async function updatePoint(data) {
    const { numClient, numticket, magasin, nocaisse, hashticket } = data; 
    const { equivalence, clientVip } = await findAndVerifyData(data);
    const ticket = await verifyTicketCaisse(numClient, numticket, magasin, nocaisse, hashticket);
    await updatePointTransaction(data, equivalence, clientVip, ticket);
    return clientVip;
}

async function findAndVerifyData(data) {
    const equivalence = await findAndVerifyEquivalence();
    const clientVip = await findAndVerifyClientVip(data.numClient);
    verifyDataUpdate(data);
    return { equivalence, clientVip };
}

async function findAndVerifyEquivalence() {
    const param = await findExistParametrage();       
    if(!param)
        throw new ErrorCode("Veuillez paramétrer l'équivalence des points");
    return param;
}

async function findAndVerifyClientVip(numClient) {
    return await verifierExistence(ClientVip, numClient, "Client VIP", [], null, "numClient");
}


function verifyDataUpdate({pointticket, bloque}){
    if(pointticket == null || bloque == null)
        throw new ErrorCode("Veuillez vérifier les données");
}

async function updatePointTransaction(data, equivalence, clientVip, ticket) {
    await sequelize.transaction(async (transaction)=>{
        await usePoint(data, equivalence, clientVip, transaction, ticket);
        await addPoint(data, equivalence, clientVip, transaction, ticket);
    })
}

async function usePoint(data, equivalence, clientVip, transaction, ticket) {
    const { used, bloque, numticket, magasin, nocaisse } = data;
    if(used){
        verifyPointToUse(bloque, clientVip);
        const point = parseFloat(clientVip.point) - parseFloat(bloque);
        await updateAndInserHistory(clientVip, numticket, magasin, nocaisse, point, equivalence, transaction, null, ticket);    
    }
}   

function verifyPointToUse(bloque, clientVip){
    if(bloque > clientVip.point)
        throw new ErrorCode("Le point à consommer est superieur au point du client");
}

async function addPoint(data, equivalence, clientVip, transaction, ticket) {
    const { numticket, magasin, nocaisse } = data;
    const point = parseFloat(clientVip.point) + parseFloat(data.pointticket);
    const dernierAchat = new Date();
    await updateAndInserHistory(clientVip, numticket, magasin, nocaisse, point, equivalence, transaction, dernierAchat, ticket);
}

async function updateAndInserHistory(clientVip, numticket, magasin, nocaisse, point, equivalence, transaction, dernierAchat, ticket) {
    const dataUpdate = { point } ;
    if(dernierAchat && clientVip.dernierAchat < dernierAchat)
        dataUpdate.dernierAchat = dernierAchat;
    await insertHistoriquePoint(clientVip, numticket, magasin, nocaisse, point, equivalence, transaction, ticket);
    await ClientVip.update(dataUpdate, {where: {id: clientVip.id}, transaction});
    clientVip.point = point; 
}

module.exports = {
    updatePoint,
    findAndVerifyEquivalence
}