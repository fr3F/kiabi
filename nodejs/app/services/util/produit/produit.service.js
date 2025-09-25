const { escape } = require("mysql2");
const { verifierExistence, dataToJson } = require("../../../helpers/helpers.helper");
const db = require("./../../../models");
const { selectSql } = require("../../../helpers/db.helper");
const { calculPrixArticle } = require("../../reporting/reporting.service");
const { Op } = require("sequelize");
// const { setNomTypePromotion } = require("../../parametrage/promotion/promotion.service");
const { getBarcodeProduct } = require("../check-prix.service");
// const { setMagasinArticleOfferts } = require("./article-offert/articleoffert.service");
const { ErrorCode } = require("../../../helpers/error");
const { DEPOT_LS } = require("../../../config/environments/mysql/environment");

const Produit = db.produit;
const ArticleTicket = db.articleTicket;
const TarifMagasin = db.tarifmagasin;
const Baremes = db.baremespourcentage;
const RemiseMagasin = db.remisemagasin;
const Stock = db.stock;
const ItemPromotion = db.itemPromotion;
const Promotion = db.promotion;
const Gamme = db.gamme;
const ArticleOffert = db.articleOffert;
const StockMagasin = db.StockMagasin;

const cat_catalogs = db.cat_catalogs
async function findProduct(itemcode){
    // const include = [
    //     "tarifmagasins", 
    //     "baremespourcentages", 
    //     "remisemagasins", 
    //     "stocks",    
    //     "gammes"
    // ];
    const resp = await verifierExistence(cat_catalogs, itemcode, "cat_catalogs", [], null, "itemcode");
    console.log("resp", resp);
    
    // await setBarcodes(resp);
    // resp.articleTickets = await getArticleTickets(code);
    return resp;
}

async function getTarifMagasins(code){
    return await TarifMagasin.findAll({where: {code}});
}


async function getArticleOfferts(code){
    let resp = await ArticleOffert.findAll({
        where: {
            codePrincipal: code,
            supprime: false
        },
        include: ["produit"],
        order: [["debut", "DESC"]]
    });
    resp = dataToJson(resp);
    // await setMagasinArticleOfferts(resp);
    return resp;
}
async function getBaremesPourcentages(code){
    return await Baremes.findAll({where: {code}});
}

async function getRemiseMagasins(code){
    return await RemiseMagasin.findAll({where: {AR_Ref: code}});
}

async function getStocks(code){
    return await Stock.findAll({where: {reference: code}});
}

async function getStocksLS(code){
    const stocks = await getStockMagasins(code);
    return stocks.filter((r)=> r.depot == DEPOT_LS);
    // return await Stock.findAll({where: {reference: code, depot: DEPOT_LS}});
}


async function getStockMagasins(code){
    const gammes = await getGammes(code);
    const where = { reference: code };
    if(gammes.length)
        where.cbMarq1 = {[Op.is]: null};
    return await StockMagasin.findAll({where});
}

async function getGammes(code){
    return await Gamme.findAll({where: {AR_Ref: code}});
}

async function getBarcodes(code){
    const  include = ["gammeObj"];
    const where = {codeproduit: code, barcode: {[Op.ne]: ''}};
    const barcodes = dataToJson(await db.barcode.findAll({where, include}));
    const barcodegifis = dataToJson(await db.barcodegifi.findAll({where, include}));
    return mergeBarcode(barcodes, barcodegifis);
}

// async function getItemPromotions(code){
//     let resp = await ItemPromotion.findAll({
//         where: {codearticle: code, supprime: {[Op.not]: true}, "$promotion.supprime$": {[Op.not]: true}},
//         include: ["promotion"],
//         order: [[{model: Promotion, as: "promotion"}, "datedebut", "DESC"]]
//     });
//     resp = dataToJson(resp);
//     for(let item of resp)
//         setNomTypePromotion(item.promotion);
//     return resp;
// }

// Fusion barcode et barcodegifi
function mergeBarcode(barcodes, barcodegifis){
    barcodegifis = barcodegifis.map((r)=>{
        r.gifi = true;
        return r;
    })
    return barcodes.concat(barcodegifis);
}

async function getArticleTickets(code){
    let articles = await ArticleTicket.findAll({
        where: {code},
        include: ["ticket"],
        order: [
            [{model: db.ticket, as: "ticket"}, "magasin", "ASC"],
            [{model: db.ticket, as: "ticket"}, "datecreation", "DESC"]
        ]
    });
    articles = dataToJson(articles);
    calculPrixArticle(articles)
    return articles;
}


async function searchProduits(search, lettre){
    search = escape(`%${search.trim()}%`);
    let sql = `SELECT code, fulldesignation FROM produit WHERE (code LIKE ${search} OR fulldesignation LIKE ${search})`;
    if(lettre)
        sql += " AND code REGEXP '^[A-Za-z]'";
    sql += " LIMIT 25";
    const rep = await selectSql(sql);
    return rep.map((r)=> `${r.code} - ${r.fulldesignation}`);
}


async function searchProduitsCategorie(search, categorie){
    search = escape(`%${search.trim()}%`);
    categorie = escape(`${categorie.trim()}%`);
    let sql = `SELECT code, fulldesignation FROM produit WHERE (code LIKE ${search} OR fulldesignation LIKE ${search}) 
                AND code LIKE ${categorie} `;
    sql += " LIMIT 25";
    const rep = await selectSql(sql);
    return rep.map((r)=> `${r.code} - ${r.fulldesignation}`);
}


async function getProduitByBarcode(barcode, idMagasin){
    const magasin = await verifierExistence(db.magasin, idMagasin, "Magasin");
    const barcodeProduct = dataToJson(await getBarcodeProduct(barcode, magasin.gifi));
    if(!barcodeProduct || !barcodeProduct.produit)
        throw new Error("Produit introuvable");
    barcodeProduct.produit.gamme = barcodeProduct.gammeObj? barcodeProduct.gammeObj.EG_Enumere: '';
    return barcodeProduct.produit;
}

async function getNomenclaturesProduitWithGammeStr(code, gamme) {
    const AG_No = await getAGNoGamme(code, gamme);
    return await getNomenclaturesProduit(code, AG_No);
}

async function  getAGNoGamme(code, gamme) {
    gamme = gamme == "null"? null: gamme;
    if(!gamme)
        return 0;
    const gammeObj = await Gamme.findOne({ 
        where: { AR_Ref: code, EG_Enumere: gamme}
    });
    return gammeObj? gammeObj.AG_No: 0;
}

async function getNomenclaturesProduit(code, gamme){
    if(!code)
        throw new ErrorCode("Veuillez renseigner le code produit");
    gamme = gamme?? 0;
    let resp = await db.nomenclature.findAll({
        where: {
            AR_Ref: code,
            AG_No1Comp: gamme 
        }
    });
    resp = dataToJson(resp);
    await addProductsGammeNomenclatures(resp);
    return resp;
}

async function addProductsGammeNomenclatures(nomenclatures){
    const codes =  nomenclatures.map((r)=> r.NO_RefDet);
    const gammes =  nomenclatures.map((r)=> r.AG_No1);
    const products = await Produit.findAll({where: {code: {[Op.in]: codes}}});
    const gammesObj = await Gamme.findAll({where: {AG_No: {[Op.in]: gammes}}});
    for(let item of nomenclatures){
        item.gamme = gammesObj.find((r)=> r.AG_No == item.AG_No1);
        item.produit = products.find((r)=> r.code == item.NO_RefDet);
    }
}
module.exports = {
    findProduct,
    searchProduits,
    getArticleTickets,
    getBarcodes,
    getBaremesPourcentages,
    getGammes,
    // getItemPromotions,
    getRemiseMagasins,
    getStocks,
    getTarifMagasins,
    getProduitByBarcode,
    getArticleOfferts,
    searchProduitsCategorie,
    getNomenclaturesProduit,
    getStockMagasins,
    getNomenclaturesProduitWithGammeStr,
    getStocksLS
}