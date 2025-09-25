const { Op } = require("sequelize");
const { DEPOT_LS, API_UPDATE_STOCK_SITE } = require("../../../config/environments/mysql/environment");
const { Mapping } = require("../../../models");
const { toUpperCaseComparaison, dataToJson } = require("../../../helpers/helpers.helper");

const { updateProductStock } = require("../../../components/others/site-web/services/prestashop/update.service");
const { loggerGlobal } = require("../../../helpers/logger");

function updateStocksSite(stocks, depot) {
    if(depot == DEPOT_LS){
        updateStocksSiteLS(stocks)
        .then((r)=>{
            loggerGlobal.info("Stock site mis à jour")
        }).catch((err)=>{
            loggerGlobal.error(err);
            loggerGlobal.error(err.stack);
        });
    }
}

async function updateStocksSiteLS(stocks) {
    const mappings = await getMappingsFromStocks(stocks);
    for(const stock of stocks){
        await updateOneStockSite(stock, mappings);
    }
}

async function getMappingsFromStocks(stocks) {
    const references = stocks.map((s)=> s.reference);
    return dataToJson(await Mapping.findAll({
        where: {reference: {[Op.in]: references}}
    }));
}


async function updateOneStockSite(stock, mappings) {
    const mapping = findMappingStock(stock, mappings);
    if(mapping)
        await callApiForUpdateStockSite(stock, mapping);
}

function findMappingStock(stock, mappings){
    return mappings.find((m)=>{
        return m.reference == stock.reference && toUpperCaseComparaison(m.gamme) == toUpperCaseComparaison(stock.gamme)
    })
}

async function callApiForUpdateStockSite(stock, mapping){
    await updateProductStock(mapping.idStockSite, stock.quantite)
}


module.exports = {
    updateStocksSite
}