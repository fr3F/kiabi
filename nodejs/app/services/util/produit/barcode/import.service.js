const { Op } = require("sequelize");
const { readListFromExcel64 } = require("../../../../helpers/file.helper");
const { barcode: Barcode, produit: Produit, sequelize, produit } = require("../../../../models");
const { getLastBarcodeNb, generateBarcode, updateLastBarcodeNb } = require("./generate.service");
const { dataToJson, toUpperCaseComparaison } = require("../../../../helpers/helpers.helper");
const { ErrorCode } = require("../../../../helpers/error");
const { verifyFormatBarcode } = require("./barcode.service");

async function importBarcodeFromFile(file){
    const list = readListFromExcel64(file);
    return await importBarcode(list);
}

async function importBarcode(list){
    const barcodes = await getBarcodesAssociated(list);
    const produits = await getProduitsAssociated(list);
    await insertBarcodes(list, barcodes, produits);
    return list;
}

async function getBarcodesAssociated(list) {
    if(!list.length)
        return [];
    const conditions = [];
    addConditionCodes(conditions, list);
    addConditionBarcodes(conditions, list);
    return dataToJson( await Barcode.findAll({
        where: {
            [Op.or]: conditions,
            barcode: {[Op.ne]: ''}
        }
    }));
}

function addConditionCodes(conditions, list){
    const codes = list.map((r)=> r.code );
    conditions.push({ codeproduit: {[Op.in]: codes }});
}

function addConditionBarcodes(conditions, list){
    const barcodes = list.map((r)=> r.barcode ).filter((r)=> r);
    if(barcodes.length)
        conditions.push({ barcode: {[Op.in]: barcodes }});
}

async function getProduitsAssociated(list) {
    if(!list.length)
        return [];
    const codes = list.map((r)=> r.code );
    return await Produit.findAll({
        where: { code: {[Op.in]: codes }},
        include: ["gammes"]
    })
}


async function insertBarcodes(list, barcodes, produits){
    await sequelize.transaction(async (transaction)=>{
        const lastNbBarcode = await getLastBarcodeNb(transaction);
        const barcodeInserts = await generateBarcodeToInserts(list, barcodes, produits, lastNbBarcode, transaction);
        await updateLastBarcodeNb(lastNbBarcode, transaction);
        await bulkCreateBarcodes(barcodeInserts, transaction);
    })
}

async function bulkCreateBarcodes(barcodeInserts, transaction) {
    await Barcode.bulkCreate(barcodeInserts, {
        transaction,
        updateOnDuplicate: ["barcode"]
    })
}

async function generateBarcodeToInserts(list, barcodes, produits, lastNbBarcode, transaction){
    const barcodeInsert = [];
    for(const item of list){
        const tmp = await generateOneBarcode(item, barcodes, produits, lastNbBarcode, transaction);
        item.barcode = tmp.barcode;
        barcodeInsert.push(tmp);
    }
    return barcodeInsert;
}

async function generateOneBarcode(item, barcodes, produits, lastNbBarcode, transaction) {
    setInfoProduitAssociated(item, produits);
    const barcodeExistant = findBarcodeAssociated(item, barcodes);
    if(barcodeExistant)
        return barcodeExistant;
    const resp = await generateNewBarcode(item, lastNbBarcode, barcodes, transaction);
    barcodes.push(resp);
    return resp;
}

function setInfoProduitAssociated(item, produits){
    const produit = produits.find((r)=> r.code == item.code);
    if(!produit)
        throw new ErrorCode("Aucun produit trouvé pour le code " + item.code);
    item.designation = produit.fulldesignation || produit.designation;
    item.qte = item.qte?? 1;
    item.AG_No = getAGNo(item, produit);
}

function getAGNo(item, produit){
    if(!item.gamme)
        return 0;
    const gamme = produit.gammes.find((r)=> toUpperCaseComparaison(r.EG_Enumere) == toUpperCaseComparaison(item.gamme));
    if(!gamme)
        throw new ErrorCode(`Le gamme ${item.gamme} n'existe pas sur le produit ${produit.code}`);
    return gamme.AG_No;
}

function findBarcodeAssociated(item, barcodes){
    return barcodes.find((r)=> r.codeproduit == item.code && 
        r.gamme == item.AG_No &&
        r.conditionnement == item.qte
    )
}

async function generateNewBarcode(item, lastNbBarcode, barcodes, transaction){
    if(!item.barcode)
        return await generateNewBarcodeNull(item, lastNbBarcode, barcodes, transaction);
    return generateNewBarcodeNotNull(item, barcodes)
}

async function generateNewBarcodeNull(item, lastNbBarcode, barcodes, transaction){
    const barcode = await generateBarcodeAuto(lastNbBarcode, barcodes, transaction);
    return {
        barcode: barcode.barcode,
        codeproduit: item.code,
        gamme: item.AG_No,
        conditionnement: item.qte,
        dateModification: new Date()
    }
}

async function generateBarcodeAuto(lastNbBarcode, barcodes, transaction){
    let barcode = await generateBarcode(lastNbBarcode, transaction);
    lastNbBarcode.numero ++;
    let exist = findBarcodeToCreateExist(barcode.barcode, barcodes);
    while(exist){
        barcode = await generateBarcode(lastNbBarcode, transaction);
        lastNbBarcode.numero ++;
        exist = findBarcodeToCreateExist(barcode.barcode, barcodes);
    }
    return barcode;
}

function generateNewBarcodeNotNull(item, barcodes){
    item.barcode = item.barcode.toString().trim();
    verifyFormatBarcode(item.barcode);
    verifyBarcodeToCreateExist(item.barcode, barcodes);
    return {
        barcode: item.barcode,
        codeproduit: item.code,
        gamme: item.AG_No,
        conditionnement: item.qte,
        dateModification: new Date()
    }
}

function verifyBarcodeToCreateExist(barcode, barcodes){
    const exist = findBarcodeToCreateExist(barcode, barcodes);
    if(exist)
        throw new ErrorCode(`Le code barre ${barcode} est déjà utilisé`);
}

function findBarcodeToCreateExist(barcode, barcodes){
    return barcodes.find((r)=> r.barcode == barcode);
}

module.exports = {
    importBarcodeFromFile
}