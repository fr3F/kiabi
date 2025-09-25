const { Op } = require("sequelize");
const { clientVip: ClientVip, sequelize, HistoriquePointVip } = require("../../../../../models");
const { findExistParametrage } = require("./parametrage.service");
const { ErrorCode } = require("../../../../../helpers/error");
const { verifierExistence, dataToJson } = require("../../../../../helpers/helpers.helper");
const { loggerGlobal } = require("../../../../../helpers/logger");
const { insertHistoriquePoint, initAllHistory, updateOldHistories, insertHistoriquePointAdd } = require("./historique.service");
const { verifyTicketCaisse } = require("./verif.service");
const { getDateExpiration } = require("../../../../../services/gifi/client-vip/activation.service");

async function addPoint({numClient, montant, numticket, magasin, nocaisse, hashticket}) {
    const ticket = await verifyTicketCaisse(numClient, numticket, magasin, nocaisse, hashticket);
    const equivalence = await findAndVerifyEquivalence();
    const clientVip = await findAndVerifyClientVip(numClient);
    const point = parseInt(montant / equivalence.equivalenceAjout);    
    await incrementPointClientVip(point, clientVip, equivalence, ticket);
    return { point }
}

async function incrementPointClientVip(point, clientVip, equivalence, ticket) {
    const pointToAdd = point;
    point = point + parseInt(clientVip.point);
    const dernierAchat = clientVip.dernierAchat < ticket.datecreation? ticket.datecreation: clientVip.dernierAchat;
    await sequelize.transaction(async (transaction)=>{
        await insertHistoriquePointAdd(pointToAdd, clientVip, ticket, equivalence, transaction);
        await ClientVip.update({point, dernierAchat}, {where: {id: clientVip.id}, transaction});
        await updateOldHistories(pointToAdd, clientVip.numClient, ticket, transaction);
    })
}


async function getPointClient(numClient) {
    const equivalence = await findAndVerifyEquivalence();
    const clientVip = await findAndVerifyClientVip(numClient, true);
    return {
        point: clientVip.point,
        equivalence: equivalence.equivalenceConso,
        conversion: equivalence.equivalenceAjout,
        type: equivalence.type,
        pointMinimum: equivalence.pointMinimum,
        tauxDiscount: equivalence.tauxDiscount
    }
}

async function usePoint({numClient, point, numticket, magasin, nocaisse}) {
    const clientVip = await findAndVerifyClientVip(numClient, true);
    const equivalence = await findAndVerifyEquivalence();
    verifyPointMinimum(clientVip, equivalence);
    await decrementPointClientVip(point, clientVip, numticket, magasin, nocaisse, equivalence);
    return { point: clientVip.point - point };
}

function verifyPointMinimum(clientVip, equivalence){
    if(clientVip.point < equivalence.pointMinimum)
        throw new ErrorCode(`Vous devez avoir au moins ${equivalence.pointMinimum} points avant l'utilisation`);
}

async function decrementPointClientVip(point, clientVip, numticket, magasin, nocaisse, equivalence) {
    if(point > clientVip.point)
        throw new ErrorCode("Le point à consommer est superieur au point du client");
    point = parseFloat(clientVip.point) - point;
    await updatePointConsoAndInsertHistory(point, clientVip, numticket, magasin, nocaisse, equivalence);
}

async function updatePointConsoAndInsertHistory(point, clientVip, numticket, magasin, nocaisse, equivalence) {
    await sequelize.transaction(async (transaction)=>{
        await insertHistoriquePoint(clientVip, numticket, magasin, nocaisse, point, equivalence, transaction);
        await ClientVip.update({point}, {where: {id: clientVip.id}, transaction});
    })
}

function resetPointAllClientSync() {
    loggerGlobal.info("Reset point client VIP");
    resetPointAllClient()
        .then(
            ()=> loggerGlobal.info("Reset point client VIP effectué")
        ).catch((err)=>{
            loggerGlobal.error("Reset point client VIP");
            loggerGlobal.error(err);
            loggerGlobal.error(err.stack);
        });
}

async function resetPointAllClient() {
    const clients = await getClientsToReset();
    if(!clients.length)
        return;
    setDateClientToReset(clients);
    await sequelize.transaction(async (transaction)=>{
        await initAllHistory(transaction);
        await ClientVip.bulkCreate(clients, { transaction, updateOnDuplicate: ["dateActivation", "dateExpiration"]})    
    })
}

async function getClientsToReset(){
    return dataToJson(await ClientVip.findAll({
        where: {
            dateActivation: {[Op.lte]: new Date()}
        }, 
    }))
}

function setDateClientToReset(clients){
    for(const client of clients){
        client.dateActivation = client.dateExpiration;
        client.dateExpiration = getDateExpiration(client.dateActivation, client.moisValidation);
    }
}

async function findAndVerifyEquivalence() {
    const param = await findExistParametrage();       
    if(!param)
        throw new ErrorCode("Veuillez paramétrer l'équivalence des points");
    return param;
}

async function findAndVerifyClientVip(numClient, verifyDate = false) {
    const client =  await verifierExistence(ClientVip, numClient, "Client VIP", [], null, "numClient");
    if(verifyDate && !client.dateActivation)
        throw new ErrorCode("Cette carte n'est pas activée");
    return client;
}

async function getHistoriquesConso(numClient) {
    await findAndVerifyClientVip(numClient);
    return await HistoriquePointVip.findAll({
        where: { numClient },
        order: [["createdAt", "DESC"], ["id", "DESC"]]
    });    
}

module.exports = {
    resetPointAllClient,
    addPoint,
    usePoint,
    getPointClient,
    resetPointAllClientSync,
    getHistoriquesConso,
    findAndVerifyClientVip
}