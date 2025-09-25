const { Op } = require("sequelize");
const { dataToJson, verifierExistence } = require("../../helpers/helpers.helper");
const db = require("../../models");
const { getDataMagasinDb } = require("../dashboard/util.service");

const Stock = db.stock;
const Magasin = db.magasin;
const Produit = db.produit;

// Stocks dans tous les dépôts
async function getStockBrut(reference, gamme){
    const where = {reference};
    addConditionGamme(where, gamme);
    const stocks = await Stock.findAll({where});
    return dataToJson(stocks);
}

function addConditionGamme(where, gamme){
    if(gamme)
        where.gamme = db.sequelize.where(
            db.sequelize.fn('UPPER', db.sequelize.col('gamme')),
            '=',
            gamme.toUpperCase()
        );
}


async function getStockBrutMagasin(reference, gamme, idMagasin){
    const magasin = await verifierExistence(Magasin, idMagasin, "Magasin", ["depots"]);
    const depotMagasins = magasin.depots;
    if(!depotMagasins.length)
        return [];
    const nomDepots = depotMagasins.map((r)=> r.nomdepot);
    const where = {
        reference,
        depot: {[Op.in]: nomDepots}
    };
    addConditionGamme(where, gamme);
    return await Stock.findAll({where});
}


async function getStocks(code, gamme){
    await verifierExistence(Produit, code, "Produit", [], null, "code");
    const stocks = await getStockBrut(code, gamme);
    const magasins = dataToJson(await Magasin.findAll());
    await setQteVenduMagasins(magasins, stocks, code);
    setQteVenduStocks(stocks, magasins);
    return stocks;
}


async function getStockMagasins(code, gamme){
    await verifierExistence(Produit, code, "Produit", [], null, "code");
    const where = {reference: code};
    addConditionGamme(where, gamme);
    const stocks = await db.StockMagasin.findAll({where});
    return dataToJson(stocks);
}

function setQteVenduStocks(stocks, magasins){
    for(const stock of stocks){
        const magasin = magasins.find(m=> m.depotstockage == stock.depot);
        if(magasin){
            let qteVendu
            if(stock.gamme)
                qteVendu = magasin.qteVendus.find(r=>  r.gamme && r.gamme.toLowerCase() == stock.gamme.toLowerCase());
            else
                qteVendu = magasin.qteVendus.find(r=> !r.gamme);
            if(qteVendu)
                stock.quantite -= qteVendu.quantite
        }
    }
}

// Qté vendu du jour pour les magasins présent dans le stock
async function setQteVenduMagasins(magasins, stocks, code){
    for(const magasin of magasins){
        magasin.qteVendus = [];
        const stock = stocks.find(r=> r.depot == magasin.depotstockage);
        if(stock)
            magasin.qteVendus = await getQteVenduMagasin(magasin, code);
    }
}

async function getQteVenduMagasin(magasin, code){
    const sql = `SELECT code, gamme, SUM(quantite) quantite
                    FROM articleticket a
                        JOIN ticket t ON (a.idticket = t.idticket)
                    WHERE a.code = '${code}' AND DATE(datecreation) = CURRENT_DATE AND depot = '${magasin.depotstockage}'
                    GROUP BY code, gamme`;
    return await getDataMagasinDb(magasin, sql);
}

module.exports = {
    getStocks,
    getStockBrutMagasin,
    getStockMagasins
}