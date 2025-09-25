const { Op } = require("sequelize");
const { ErrorCode } = require("../../../../helpers/error");
const { isNumber } = require("../../../../helpers/helpers.helper");
const { produit: Produit, HistoriquePrix, ItemHistoriquePrix } = require("../../../../models");


function validatePrixNumberValid(priceNumber){
    if(!isNumber(priceNumber) || priceNumber < 0)
        throw new ErrorCode("Veuillez renseigner des prix valides");
}

function validateCodePrix(price){
    if(!price.code)
        throw new ErrorCode("Veuillez renseigner le code");
}

async function getProduitsFromCodes(codes){
    return await Produit.findAll({
        where: {
            code: {[Op.in]: codes}
        },
        raw: true
    })
}

function findProduitForUpdate(produits, data){
    const produit = produits.find((r)=> r.code == data.code);
    return produit;
}

async function insertHistoriesToBdd(histories, idUser, idMagasin, transaction) {
    const idHistorique = await insertHistoryPrincipal(idUser, histories.length, idMagasin, transaction);
    await insertItemHistories(histories, idHistorique, transaction);
}

async function insertHistoryPrincipal(idUser, nombreProduit, idMagasin, transaction){
    const data = await HistoriquePrix.create({idUser, idMagasin, nombreProduit}, {transaction});
    return data.id;
}

async function insertItemHistories(histories, idHistorique, transaction){
    if(!histories.length)
        return;
    for(const history of histories)
        history.idHistorique = idHistorique;
    await ItemHistoriquePrix.bulkCreate(histories, {transaction});
}


module.exports = {
    validateCodePrix,
    validatePrixNumberValid,
    getProduitsFromCodes,
    findProduitForUpdate,
    insertHistoriesToBdd
}