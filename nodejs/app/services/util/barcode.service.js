const { Op } = require("sequelize");
const db = require("./../../models");
const { dataToJson } = require("../../helpers/helpers.helper");
const { ErrorCode } = require("../../helpers/error");
const BarCode = db.barcode;
const BarCodeGifi = db.barcodegifi;
const Stock = db.stock;
const Produit = db.produit;

// Recuperer code produit et gamme pour les codes barres
async function getCodeGammeByBarcode(barcodes){
    const option = {
        where: {barcode: {[Op.in]: barcodes}},
        include: ["gammeObj"]
    };
    const bars = dataToJson(await BarCode.findAll(option));
    const barsGifi = dataToJson(await BarCodeGifi.findAll(option));
    for(const bar of barsGifi){
        const tmp = bars.find((r)=> r.barcode == bar.barcode);
        if(!tmp)
            bars.push(bar);
    }
    return bars;
}

// Recuperer produit par des codes produits
async function getProduitByCodes(codes){
    return await Produit.findAll({
        where: {code: {[Op.in]: codes}}
    })
}

async function getStocksByCodes(codes, depot){
    return await Stock.findAll({
        where: {
            reference: {[Op.in]: codes}, 
            depot
        },
    })
} 

async function getInfoProduitsByBarcode(barcodes, depot){
    if(!barcodes || !Array.isArray(barcodes) || !barcodes.length)
        throw new Error("Veuillez renseigner les codes barres");
    if(!depot)
        throw new Error("Veuillez renseigner le depot");
    const tabBarCodes = await getCodeGammeByBarcode(barcodes);
    const codes = tabBarCodes.map((r)=> r.codeproduit);
    const produits = await getProduitByCodes(codes);
    const stocks = await getStocksByCodes(codes, depot);
    return generateInfoProduits(barcodes, tabBarCodes, produits, stocks);
}

function generateInfoProduits(barcodes, tabBarCodes, produits, stocks){
    const resp = [];
    for(let barcode of barcodes){
        resp.push(generateInfoBarcode(barcode, tabBarCodes, produits, stocks));
    }
    return resp;
}

function generateInfoBarcode(barcode, tabBarCodes, produits, stocks){
    const resp = {barcode};
    const barCodeObj = tabBarCodes.find((r)=> r.barcode == barcode);
    if(!barCodeObj)
        return resp;
    resp.code = barCodeObj.codeproduit;
    resp.gamme = barCodeObj.gammeObj? barCodeObj.gammeObj.EG_Enumere: null;
    const produit = produits.find((r)=> r.code == resp.code);
    if(!produit){
        return resp;
    }
    resp.designation = produit.designation;
    resp.prix = produit.prixhtprincipal; 
    setStock(stocks, resp); // quantité théorique
    return resp;
}

function setStock(stocks, produit){
    let stock;
    if(produit.gamme)
        stock = stocks.find((r)=> r.reference == produit.code && r.gamme && r.gamme.toLowerCase() == produit.gamme.toLowerCase());
    else
        stock = stocks.find((r)=> r.reference == produit.code && !r.gamme);
    if(stock)
        produit.qteTheorique = stock.quantite;
}

// Recuperer barcode 
async function findBarcode(barcode){
    if(!barcode)
        throw new ErrorCode("Veuillez renseigner le code barre");
    let resp = await BarCode.findOne({where: {barcode}});
    if(resp)
        return resp;
    resp = await BarCodeGifi.findOne({where: {barcode}});
    if(!resp)
        throw new ErrorCode("Code barre introuvable");
    return resp;
}

module.exports = {
    getInfoProduitsByBarcode,
    findBarcode
}