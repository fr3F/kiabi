const { dataToJson } = require("../../../../helpers/helpers.helper");
const { isNumber } = require("../../../../helpers/util.helper");
const { DernierNumero, barcode: Barcode } = require("../../../../models");

const PREFIX = "620";
const TYPE_DERNIER_NUMERO = "BARCODE_NB";
const PAD_LENGTH = 10;

async function generateBarcode(lastNb = null, transaction = null) {
    lastNb = lastNb ?? await getLastBarcodeNb(transaction);
    let barcode = generateNextBarcode(lastNb);
    barcode = await verifyBarcodeExistant(lastNb, barcode, transaction);
    return { barcode };
}

async function getLastBarcodeNb(transaction) {
    const lastNb = await findLastBarcodeNbDb(transaction);
    if(isLastBarcodeValid(lastNb))
        return nbBarcodeToJson(lastNb);
    return await createFirstBarcodeNb(transaction);
}

function nbBarcodeToJson(data){
    data = dataToJson(data);
    data.numero = parseInt(data.numero)
    return data;
}

async function findLastBarcodeNbDb(transaction) {
    return await DernierNumero.findOne({
        where: {type: TYPE_DERNIER_NUMERO},
        transaction
    });
}

function isLastBarcodeValid(lastNb){
    return (lastNb && isNumber(lastNb.numero))
}

async function createFirstBarcodeNb(transaction) {
    return nbBarcodeToJson(await DernierNumero.create({
        numero: 1000000,
        type: TYPE_DERNIER_NUMERO 
    }, { transaction }));
}

function generateNextBarcode(lastNb){
    const nextNb = (lastNb.numero + 1).toString().padStart(PAD_LENGTH, "0");
    return `${PREFIX}${nextNb}`;
}

async function verifyBarcodeExistant(lastNb, barcode, transaction) {
    let exist = await verifyBarcodeExistantDb(barcode, transaction);
    while(exist){
        lastNb.numero ++;
        barcode = generateNextBarcode(lastNb);
        exist = await verifyBarcodeExistantDb(barcode, transaction);
    }
    await updateLastBarcodeNb(lastNb, transaction);
    return barcode;
}

async function updateLastBarcodeNb(lastNb, transaction) {
    await DernierNumero.update(lastNb, { where: {id: lastNb.id}, transaction });
}

async function verifyBarcodeExistantDb(barcode, transaction) {
    return await Barcode.findOne({
        where: { barcode },
        transaction
    })
}

module.exports = {
    generateBarcode,
    getLastBarcodeNb,
    updateLastBarcodeNb
}