const { ErrorCode } = require("../../../../../helpers/error");
const { formatDate } = require("../../../../../helpers/helpers.helper");
const { LOYACT_ACTION, READJUST_CAUSE, TRANSFERT_CAUSE, BLOCKING_CAUSE, POINT_LABEL } = require("./constant");
const { findAndVerifyClient, insertLoyact, verifyClientAndPoints, generateLoyact, verifyCause } = require("./util.service");

async function addCardCreation({noCarte}, transaction){
    const optinFid = true;
    const client = await findAndVerifyClient(noCarte, transaction);
    const loyact = generateCardCreation(client, optinFid);
    return await insertLoyact(loyact, client, POINT_LABEL.creation, transaction);
}

function generateCardCreation(client, optinFid){
    optinFid = optinFid?? false;
    return generateLoyact(client, null, LOYACT_ACTION.cardCreation, null, null, optinFid);
}

async function addTicketRecovery({noCarte, nbPoints, numticket }, transaction){
    verifyNumticket(numticket);
    const client = await verifyClientAndPoints(noCarte, nbPoints, transaction);
    const loyact = generateTicketRecovery(client, nbPoints);
    return await insertLoyact(loyact, client, numticket, transaction);
}

function verifyNumticket(numticket){
    if(!numticket)
        throw new ErrorCode("Veuillez renseigner le numéro ticket")
}

function generateTicketRecovery(client, nbPoints){
    return generateLoyact(client, nbPoints, LOYACT_ACTION.ptReadjust, READJUST_CAUSE.ticket);
}

async function addAnniversary({noCarte, nbPoints}, transaction){
    const client = await verifyClientAndPoints(noCarte, nbPoints, transaction);
    verifyClientAnniversary(client);
    const loyact = generateAnniversary(client, nbPoints);
    return await insertLoyact(loyact, client, POINT_LABEL.anniv, transaction);
}

function verifyClientAnniversary(client){
    const dateNow = formatDate(new Date(), "MM-DD");
    const dateAnniversaire = formatDate(new Date(client.dateAnniversaire), "MM-DD");
    if(dateNow != dateAnniversaire)
        throw new ErrorCode("L'anniversaire du client n'est pas aujourd'hui");
}

function generateAnniversary(client, nbPoints){
    return generateLoyact(client, nbPoints, LOYACT_ACTION.ptReadjust, READJUST_CAUSE.birthday);
}

async function addBirthPoints({noCarte, nbPoints}, transaction){
    const client = await verifyClientAndPoints(noCarte, nbPoints, transaction);
    const loyact = generateBirth(client, nbPoints);
    return await insertLoyact(loyact, client, POINT_LABEL.birth, transaction);
}

function generateBirth(client, nbPoints){
    return generateLoyact(client, nbPoints, LOYACT_ACTION.ptReadjust, READJUST_CAUSE.birth);
}

async function addWelcomePack({noCarte, nbPoints}, transaction){
    const client = await verifyClientAndPoints(noCarte, nbPoints, transaction);
    const loyact = generateWelcomePack(client, nbPoints);
    return await insertLoyact(loyact, client, POINT_LABEL.welcome, transaction);
}

function generateWelcomePack(client, nbPoints){
    return generateLoyact(client, nbPoints, LOYACT_ACTION.ptReadjust, READJUST_CAUSE.welcome);
}

async function addMarketingOperation({noCarte, nbPoints, numticket}, transaction){
    numticket = getNumticketMarketing(numticket);
    const client = await verifyClientAndPoints(noCarte, nbPoints, transaction);
    const loyact = generateMarketingOperation(client, nbPoints);
    return await insertLoyact(loyact, client, numticket, transaction);
}

function getNumticketMarketing(numticket){
    return numticket?? POINT_LABEL.marketing;
}

function generateMarketingOperation(client, nbPoints){
    return generateLoyact(client, nbPoints, LOYACT_ACTION.ptReadjust, READJUST_CAUSE.marketing);
}

async function addCardTransfert({noCarte, newNoCarte, cause}, transaction){
    const client = await findAndVerifyClient(noCarte, transaction);
    validateCardTransfert(newNoCarte, cause);
    const loyact = generateCardTransfert(client, newNoCarte, cause);
    return await insertLoyact(loyact, client, null, transaction);
}

function validateCardTransfert(newNoCarte, cause){
    verifyCause(TRANSFERT_CAUSE, cause);
    if(!newNoCarte)
        throw new ErrorCode("Veuillez renseigner le nouveau numéro de la carte");
}

function generateCardTransfert(client, newNoCarte, cause){
    return generateLoyact(client, null, LOYACT_ACTION.cardTransfert, cause, newNoCarte);
}

async function addCardBlocking({noCarte, cause}, transaction){
    const client = await findAndVerifyClient(noCarte, transaction);
    verifyCause(BLOCKING_CAUSE, cause);
    const loyact = generateCardBlocking(client, cause);
    return await insertLoyact(loyact, client, null, transaction, true);
}

function generateCardBlocking(client, cause){
    return generateLoyact(client, null, LOYACT_ACTION.cardBlocking, cause);
}

module.exports = {
    addCardCreation,
    addTicketRecovery,
    addAnniversary,
    addBirthPoints,
    addWelcomePack,
    addMarketingOperation,
    addCardTransfert,
    addCardBlocking
}