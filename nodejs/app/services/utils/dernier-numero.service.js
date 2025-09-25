const { dataToJson } = require("../../helpers/helpers.helper");
const { DernierNumero } = require("../../models");

const TYPE_NUMERO = {
    destocking: "DESTOCKING",
    client: "CLIENT"
}

const LENGTH_NUMERO = {
    destocking: 7,
    client: 7,
    numCarte: 12
}

async function getDernierNumero(type, transaction) {
    const num = await findExistingNumero(type, transaction);
    if(num)
        return dataToJson(num); 
    return await createFirstNumero(type, transaction);
}

async function findExistingNumero(type, transaction) {
    return await DernierNumero.findOne({
        where: { type },
        transaction
    })
}

async function createFirstNumero(type, transaction) {
    const num = { type, numero: 0 };
    await DernierNumero.create(num, {transaction})
    return dataToJson(await findExistingNumero(type, transaction));
}

async function getNextDestockingNumber(transaction) {
    const dernier = await getDernierNumero(TYPE_NUMERO.destocking, transaction);
    dernier.numero = parseInt(dernier.numero) + 1;
    await updateDernierNumero(dernier, transaction);
    return generateNumeroFromNumber(dernier.numero, LENGTH_NUMERO.destocking);
}

async function getNextCodeClient(transaction) {
    const dernier = await getDernierNumero(TYPE_NUMERO.client, transaction);
    dernier.numero = parseInt(dernier.numero) + 1;
    await updateDernierNumero(dernier, transaction);
    return generateNumeroFromNumber(dernier.numero, LENGTH_NUMERO.client);
}

async function updateDernierNumero(dernier, transaction) {
    await DernierNumero.update(dernier, 
        {where: {id: dernier.id}, transaction
    });
}

function generateNumeroFromNumber(numero, length){
    return numero.toString().padStart(length, "0");
}

module.exports = {
    getDernierNumero,
    getNextDestockingNumber,
    getNextCodeClient,
    LENGTH_NUMERO

}