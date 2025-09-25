const { Op } = require("sequelize");
const { ErrorCode } = require("../../../../helpers/error");
const { readListFromExcel64 } = require("../../../../helpers/file.helper");
const { isNumber } = require("../../../../helpers/helpers.helper");
const { produit: Produit, sequelize, HistoriquePrix, ItemHistoriquePrix } = require("../../../../models");
const { validateCodePrix, validatePrixNumberValid, getProduitsFromCodes, findProduitForUpdate, insertHistoriesToBdd } = require("./util");

async function updatePrixProduitFromFile(file, idUser) {
    const prices = readListFromExcel64(file);
    if(!prices.length)
        throw new ErrorCode("Veuillez renseigner au moins une ligne");
    return await updatePrixProduits(prices, idUser);
}

async function updatePrixProduits(prices, idUser) {
    const codes = validatePrixAndGetCodes(prices)
    const produits = await getProduitsFromCodes(codes);
    const { dataUpdate, histories, invalidCodes } = generateDataForUpdatesAndHistories(produits, prices);
    await updatePricesAndHistoriesToBdd(dataUpdate, histories, idUser);
    return invalidCodes;
}

function validatePrixAndGetCodes(prices){
    const codes = [];
    for(const price of prices){
        validateOnePrix(price);
        codes.push(price.code);
    }
    return codes;
}

function validateOnePrix(price){
    validateCodePrix(price);
    validatePrixNumberValid(price.prixHT);
    validatePrixNumberValid(price.prixTTC);
}

function generateDataForUpdatesAndHistories(produits, prices){
    const dataUpdate = [];
    const histories = [];
    const invalidCodes = [];
    for(const price of prices){
        const produit = findProduitForUpdate(produits, price);
        if(produit){
            histories.push(generateItemHistoryUpdate(produit, price));
            dataUpdate.push(generateDataForUpdate(produit, price));
        }
        else
            invalidCodes.push(price.code);
    }
    return {dataUpdate, histories, invalidCodes};
}

function generateItemHistoryUpdate(produit, price){
    return {
        code: produit.code,
        oldPrixHT: produit.prixhtprincipal,
        oldPrixTTC: produit.prixttcprincipal,
        newPrixHT: price.prixHT,
        newPrixTTC: price.prixTTC,
    }
}

function generateDataForUpdate(produit, price){
    produit.prixhtprincipal = price.prixHT;
    produit.prixttcprincipal = price.prixTTC;
    produit.dateModification = new Date();
    return produit;
}

async function updatePricesAndHistoriesToBdd(dataUpdate, histories, idUser) {
    await sequelize.transaction(async (transaction)=>{
        await updatePricesToBdd(dataUpdate, transaction);
        await insertHistoriesToBdd(histories, idUser, null, transaction);
    });   
}

async function updatePricesToBdd(dataUpdate, transaction) {
    if(!dataUpdate.length)
        return;
    const updateOnDuplicate = ["dateModification", "prixttcprincipal", "prixhtprincipal"];
    await Produit.bulkCreate(dataUpdate, {
        transaction,
        updateOnDuplicate
    })
}




module.exports = {
    updatePrixProduitFromFile,
}