const { Op } = require("sequelize");
const { ErrorCode } = require("../../../../helpers/error");
const { readListFromExcel64 } = require("../../../../helpers/file.helper");
const { isNumber, verifierExistence } = require("../../../../helpers/helpers.helper");
const { produit: Produit, sequelize, magasin: Magasin, tarifmagasin: TarifMagasin } = require("../../../../models");
const { validateCodePrix, validatePrixNumberValid, getProduitsFromCodes, findProduitForUpdate, insertHistoriesToBdd } = require("./util");

async function updateTarifMagasinFromFile(file, idUser, idMagasin) {
    const tarifs = readListFromExcel64(file);
    if(!tarifs.length)
        throw new ErrorCode("Veuillez renseigner au moins une ligne");
    return await updateTarifMagasins(tarifs, idUser, idMagasin);
}

async function updateTarifMagasins(tarifs, idUser, idMagasin) {
    const codes = validateTarifAndGetCodes(tarifs);
    const magasin = await validateMagasin(idMagasin);
    const tarifExistants = await getTarifMagasinExistants(codes, magasin.identifiant); 
    const produits = await getProduitsFromCodes(codes);
    const { dataUpdate, histories, invalidCodes } = generateDataForUpdatesAndHistories(produits, tarifs, tarifExistants, magasin.identifiant);
    await updateTarifsAndHistoriesToBdd(dataUpdate, histories, idUser, idMagasin);
    return invalidCodes;
}

function validateTarifAndGetCodes(tarifs){
    const codes = [];
    for(const tarif of tarifs){
        validateOneTarif(tarif);
        codes.push(tarif.code);
    }
    return codes;
}

function validateOneTarif(tarif){
    validateCodePrix(tarif);
    validatePrixNumberValid(tarif.prixTarifHT);
}

async function validateMagasin(idMagasin){
    return await verifierExistence(Magasin, idMagasin, "Magasin");
}

async function getTarifMagasinExistants(codes, idenfiantMagasin) {
    return await TarifMagasin.findAll({
        where: {
            code: {[Op.in]: codes},
            magasin: idenfiantMagasin
        },
        raw: true
    })
}

function generateDataForUpdatesAndHistories(produits, tarifs, tarifExistants, identifiantMagasin){
    const dataUpdate = [];
    const histories = [];
    const invalidCodes = [];
    for(const tarif of tarifs){
        const produit = findProduitForUpdate(produits, tarif);
        if(produit){
            const tarifExistant = findTarifExistantForUpdate(tarifExistants, tarif);
            histories.push(generateItemHistoryUpdate(tarif, tarifExistant));
            dataUpdate.push(generateDataForUpdate(tarif, tarifExistant, identifiantMagasin));
        }
        else
            invalidCodes.push(tarif.code);
    }
    return {dataUpdate, histories, invalidCodes};
}


function findTarifExistantForUpdate(tarifExistants, data){
    const tarifExistant = tarifExistants.find((r)=> r.code == data.code);
    return tarifExistant;
}
function generateItemHistoryUpdate(tarif, tarifExistant){
    return {
        code: tarif.code,
        oldPrixHT: tarifExistant? tarifExistant.prixventeht: 0,
        newPrixHT: tarif.prixTarifHT,
    }
}

function generateDataForUpdate(tarif, tarifExistant, identifiantMagasin){
    return {
        idtarifmagasin: tarifExistant? tarifExistant.idtarifmagasin: null,
        code: tarif.code,
        prixventeht: tarif.prixTarifHT,
        magasin: identifiantMagasin,
        dateModification: new Date()
    }
}

async function updateTarifsAndHistoriesToBdd(dataUpdate, histories, idUser, idMagasin) {
    await sequelize.transaction(async (transaction)=>{
        await updateTarifsToBdd(dataUpdate, transaction);
        await insertHistoriesToBdd(histories, idUser, idMagasin, transaction);
    });   
}

async function updateTarifsToBdd(dataUpdate, transaction) {
    if(!dataUpdate.length)
        return;
    const updateOnDuplicate = ["dateModification", "code", "prixventeht"];
    await TarifMagasin.bulkCreate(dataUpdate, {
        transaction,
        updateOnDuplicate
    })
}


module.exports = {
    updateTarifMagasinFromFile,
}