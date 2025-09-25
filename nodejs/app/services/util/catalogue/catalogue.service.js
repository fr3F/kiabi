const { Op } = require("sequelize");
const { verifierExistence, dataToJson } = require("../../../helpers/helpers.helper");
const db = require("./../../../models");
const { checkPrixArticleParCode2, checkPrixArticleParProduit } = require("../check-prix.service");
const Catalogue = db.catalogue;
const Magasin = db.magasin;
const Stock = db.stock;
const Produit = db.produit;
const TarifMagasin = db.tarifmagasin;
const RemiseMagasin = db.remisemagasin;

const helper = require("./../../../helpers/helpers.helper"); 
const { selectSql } = require("../../../helpers/db.helper");

const updateOnDuplicate = ["designation", "prixdevente", "prixht", "tauxtva", "remise", "stock"];

async function initialiserCatalogues(idMagasin){
    const magasin = await verifierExistence(Magasin, idMagasin, "Magasin");
    const stocks = await Stock.findAll({where: {depot: magasin.depotstockage}});
    const barcodes = await getBarcodeStocks(stocks);
    const {products, remiseGifis, prixVips, tarifMagasins, remiseMagasins} = await getProduitStocks(stocks, magasin);
    const catalogues = await generateCatalogues(stocks, products, magasin, barcodes, 
        remiseGifis, prixVips, tarifMagasins, remiseMagasins
    );
    await db.sequelize.transaction(async (transaction)=>{
        await Catalogue.destroy({where:{magasin: magasin.nommagasin}, transaction});
        await insertCatalogues(catalogues, transaction);
    })
    return catalogues;
}

async function getBarcodeStocks(stocks){
    const codeproduits = stocks.map((r)=> r.reference);
    const option = {where: {codeproduit: {[Op.in]: codeproduits}}, include: ["gammeObj"]};
    return dataToJson(await db.barcode.findAll(option));
}

async function insertCatalogues(catalogues, transaction){
    const batchSize = 5000;
    const totalCatalogues = catalogues.length;

    for (let i = 0; i < totalCatalogues; i += batchSize) {
        const cataloguesSlice = catalogues.slice(i, i + batchSize);
        if (cataloguesSlice.length > 0) {
            await Catalogue.bulkCreate(cataloguesSlice, { transaction, updateOnDuplicate });
        }
    }
}

// Avec les remises(gifi, magasin), prix vip, tarif magasins
async function getProduitStocks(stocks, magasin){
    const codes = stocks.map((r)=> r.reference);
    const products =  dataToJson(await Produit.findAll({where: {code: {[Op.in]: codes}}, include: ["baremespourcentages"]}));
    const {remiseGifis, prixVips} = await getPromoVipGifi(codes, magasin);
    const {tarifMagasins, remiseMagasins} = await getTarifAndRemiseMagasins(magasin, codes);
    return {products, remiseGifis, prixVips, tarifMagasins, remiseMagasins};
}

async function getPromoVipGifi(codes, magasin){
    if(!magasin.gifi || !codes.length)
        return {prixVips: [], remiseGifis: []};
    const code =  "'" + codes.join("', '") + "'";
    const sql = `SELECT i.taux AC_Remise, typePromotion, p.typeprom, codearticle code
                    FROM promotion p
                    JOIN itempromotion i on (i.idpromotion = p.id)
                        WHERE i.codearticle IN(${code}) 
                            AND p.datedebut <= now() 
                            and p.datefin >= now() 
                            and p.magasin = '${magasin.nommagasin}'
                            AND i.supprime is not true
                            AND p.supprime is not true
                        ORDER BY i.id DESC`;
    const data = await selectSql(sql);
    let prixVips = data.filter(r=> r.typeprom == 2);
    let remiseGifis = data.filter(r=> r.typeprom == 1);
    return {prixVips, remiseGifis}
}

async function getTarifAndRemiseMagasins(magasin, codes){
    if(!codes.length)
        return {tarifMagasins: [], remiseMagasins: []};
    const order =  [["dateModification", "DESC"]];
    const tarifMagasins = await TarifMagasin.findAll({where: {magasin: magasin.identifiant, code:{[Op.in]: codes}}, order});
    const remiseMagasins = await RemiseMagasin.findAll({where: {CT_Num: magasin.identifiant, AR_Ref:{[Op.in]: codes}}, order});
    return {tarifMagasins, remiseMagasins};
}

async function generateCatalogues(stocks, produits, magasin, barcodes,  
        remiseGifis, prixVips, tarifMagasins, remiseMagasins){ // Ajout paramètre supplémentaire pour le calcul des prix
    const resp = [];
    for(const stock of stocks){
        const barcode = getBarcodeStock(stock, barcodes);
        const item = {code: stock.reference, magasin: magasin.nommagasin, gamme: stock.gamme, stock: stock.quantite};
        if(barcode)
            item.barcode = barcode.barcode;
        const produit = produits.find((r)=> r.code == stock.reference);
        if(produit){
            await setPrixProduit(produit, magasin, remiseGifis, prixVips, tarifMagasins, remiseMagasins, stock.gamme);
            setInfoProduitCatalogue(item, produit);
        } 
        resp.push(item);
    }
    return resp;
}


// Utilisation de check prix pour calculer les prix des catalogues
async function setPrixProduit(product, magasin, remiseGifis, prixVips, tarifMagasins, remiseMagasins, gamme){
    product.noDb = true;
    product.remiseGifi = getInfoGifi(product.code, gamme, remiseGifis);
    product.prixVipGifi = getInfoGifi(product.code, gamme, prixVips);
    product.tarifMagasin = tarifMagasins.find((r)=> r.code == product.code);
    product.remiseMagasin = remiseMagasins.find((r)=> r.AR_Ref == product.code);
    const tmp = await checkPrixArticleParProduit(product, magasin, gamme);
    product.remise = tmp.tauxremisesage;
    product.prixdevente = tmp.prix;
    product.prixht = tmp.prixht;
}

function getInfoGifi(code, gamme, list){
    if(!gamme)
        return list.find((r)=> r.code == code && !r.gamme);
    gamme = gamme.toString().toUpperCase();
    return list.find((r)=> r.code == code && r.gamme.toString().toUpperCase() == gamme);
}

function getBarcodeStock(stock, barcodes){
    if(!stock.gamme)
        return barcodes.find((r)=> r.codeproduit == stock.reference);
    const gamme = stock.gamme.toUpperCase();
    return barcodes.find((r)=> r.codeproduit == stock.reference && r.gammeObj && r.gammeObj.EG_Enumere.toUpperCase() == gamme); 
}

function setInfoProduitCatalogue(item, produit){
    item.designation = produit.fulldesignation;
    item.tauxtva = produit.tauxtva;
    item.prixdevente = produit.prixdevente;
    item.prixht = produit.prixht;
    item.remise = produit.remise;
}

async function getListCatalogues(req){
    let { page, limit, offset } = helper.getVarNecessairePagination(req);
    let option = await getOptionGetList(req, limit, offset);
    let rep = await Catalogue.findAndCountAll(option);
    return helper.getPagingData(rep, page, limit)
};

async function getOptionGetList(req, limit, offset){
    let filters = await getFiltreRecherche(req);
    return {
        where: filters,
        limit, offset,
        // order: [["code", "ASC"]]
    };
}

async function getFiltreRecherche(req){
    let filters = helper.getFiltreRecherche(req, ["code", "designation"]);
    if(!req.query.search)
        filters = {};
    if(req.query.magasin)
        filters.magasin = req.query.magasin;
    return filters;
}

async function updateCatalogue(idMagasin, code){
    if(!code)
        throw new Error("Veuillez renseigner le code produit");
    const magasin = await verifierExistence(Magasin, idMagasin, "Magasin");
    const stocks = await Stock.findAll({where: {depot: magasin.depotstockage, reference: code}});
    const barcodes = await getBarcodeStocks(stocks);
    const {products, remiseGifis, prixVips, tarifMagasins, remiseMagasins} = await getProduitStocks(stocks, magasin);
    const catalogues = await generateCatalogues(stocks, products, magasin,  barcodes, 
        remiseGifis, prixVips, tarifMagasins, remiseMagasins);
    await db.sequelize.transaction(async (transaction)=>{
        await Catalogue.destroy({where:{magasin: magasin.nommagasin, code}, transaction});
        await insertCatalogues(catalogues, transaction);
    })
    return catalogues;
}

module.exports = {
    initialiserCatalogues,
    getListCatalogues,
    updateCatalogue
}