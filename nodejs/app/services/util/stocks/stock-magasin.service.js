const { Op } = require("sequelize");
const { toUpperCaseComparaison, verifierExistence } = require("../../../helpers/helpers.helper");
const { StockMagasin, sequelize, magasin: Magasin } = require("../../../models");
const { ErrorCode } = require("../../../helpers/error");
const { updateStocksSite } = require("./site-web.service");

/**
 * Updates the stock for a given depot with provided items.
 * @param {string} depot - The depot identifier.
 * @param {Array} items - Array of items to update.
 * @param {Object} transaction - Sequelize transaction object.
 * @param {string} qtyColumn - Column for quantity (default: "quantiteRecu").
 * @param {string} codeColumn - Column for item code (default: "code").
 * @param {number} sign - Sign for quantity adjustment (default: 1).
 */
async function updateStockMagasin(depot, items, transaction, qtyColumn = "quantiteRecu", codeColumn = "code", sign = 1) {
    if (!items.length) return;
    items = aggregateItems(items, qtyColumn, codeColumn)
    const stocks = await mergeActualStocks(items, depot, transaction, qtyColumn, codeColumn, sign);
    if (stocks.length) {
        await bulkUpdateStocks(stocks, transaction);
        updateStocksSite(stocks, depot);
    }
}

function aggregateItems(items, qtyColumn, codeColumn){
    const resp = [];
    for(const item of items){
        addItemToListAggregated(item, resp, qtyColumn, codeColumn);
    }
    return resp;
}

function addItemToListAggregated(item, list, qtyColumn, codeColumn){
    const exist = findExistingItems(item, list, codeColumn);
    if(!exist)
        list.push(item);
    else{
        exist[qtyColumn] = parseFloat(exist[qtyColumn]) + parseFloat(item[qtyColumn]);
    }
}

function findExistingItems(item, list, codeColumn){
    return list.find((r)=> 
        r[codeColumn] == item[codeColumn] &&
        toUpperCaseComparaison(r.gamme) == toUpperCaseComparaison(item.gamme)
    )
}

/**
 * Merges actual stocks based on the provided items.
 * @param {Array} items - Items to be merged.
 * @param {string} depot - The depot identifier.
 * @param {Object} transaction - Sequelize transaction object.
 * @param {string} qtyColumn - Column for quantity.
 * @param {string} codeColumn - Column for item code.
 * @param {number} sign - Sign for quantity adjustment.
 * @returns {Promise<Array>} - Array of stocks to be created or updated.
 */
async function mergeActualStocks(items, depot, transaction, qtyColumn, codeColumn, sign) {
    const codes = items.map(item => item[codeColumn]);
    const stocks = await fetchCurrentStocks(codes, depot, transaction);

    return items.map(item => {
        const stock = findMatchingStock(item, stocks, codeColumn);
        return stock ? mergeStock(item, stock, qtyColumn, sign) : createNewStock(item, depot, codeColumn, qtyColumn, sign);
    });
}


/**
 * Fetches current stocks from the database.
 * @param {Array} codes - Array of item codes.
 * @param {string} depot - The depot identifier.
 * @param {Object} transaction - Sequelize transaction object.
 * @returns {Promise<Array>} - Current stocks from the database.
 */
async function fetchCurrentStocks(codes, depot, transaction) {
    return await StockMagasin.findAll({
        where: {
            reference: { [Op.in]: codes },
            depot
        },
        transaction,
        raw: true
    });
}

/**
 * Finds a matching stock item based on the given item.
 * @param {Object} item - The item to match.
 * @param {Array} stocks - Array of current stocks.
 * @param {string} codeColumn - Column for item code.
 * @returns {Object|null} - Matching stock or null if not found.
 */
function findMatchingStock(item, stocks, codeColumn) {
    return stocks.find(stock => 
        stock.reference == item[codeColumn] && 
        toUpperCaseComparaison(stock.gamme) == toUpperCaseComparaison(item.gamme)
    );
}

/**
 * Merges stock information and updates quantity.
 * @param {Object} item - The new item data.
 * @param {Object} stock - The existing stock data.
 * @param {string} qtyColumn - Column for quantity.
 * @param {number} sign - Sign for quantity adjustment.
 * @returns {Object} - Merged stock object.
 */
function mergeStock(item, stock, qtyColumn, sign) {
    return {
        ...stock,
        quantite: parseFloat(stock.quantite) + parseFloat(item[qtyColumn]) * sign,
        dateModification: new Date()
    };
}

/**
 * Creates a new stock entry.
 * @param {Object} item - The item data.
 * @param {string} depot - The depot identifier.
 * @param {string} codeColumn - Column for item code.
 * @param {string} qtyColumn - Column for quantity.
 * @param {number} sign - Sign for quantity adjustment.
 * @returns {Object} - New stock object.
 */
function createNewStock(item, depot, codeColumn, qtyColumn, sign) {
    return {
        depot,
        gamme: item.gamme,
        reference: item[codeColumn],
        dateModification: new Date(),
        quantite: item[qtyColumn] * sign
    };
}

/**
 * Bulk updates stocks in the database.
 * @param {Array} stocks - Array of stocks to be updated.
 * @param {Object} transaction - Sequelize transaction object.
 */
async function bulkUpdateStocks(stocks, transaction) {
    await StockMagasin.bulkCreate(stocks, {
        transaction,
        updateOnDuplicate: ["quantite", "dateModification"]
    });
}

/**
 * Updates the stock for a given depot with provided items(ventes).
 * @param {string} depot - The depot identifier.
 * @param {Array} items - Array of items to update.
 * @param {Object} transaction - Sequelize transaction object.
 */
async function updateStockMagasinVente(depot, items, transaction = null) {
    if(!Array.isArray(items))
        throw new ErrorCode("Veuillez renseigner les articles tickets")
    items = items.filter(item=> item.code); // Seulement les articles avec codes
    if(transaction)
        await updateStockMagasin(depot, items, transaction, "quantite", "code", -1);
    else{
        await sequelize.transaction(async (t)=>{
            await updateStockMagasin(depot, items, t, "quantite", "code", -1);
        });
    }
}
/**
 * Updates the stock for a given depot with provided items(ventes).
 * @param {string} codemagasin - The codemagasin (identifier).
 * @param {Array} items - Array of items to update.
 * @param {Object} transaction - Sequelize transaction object.
 */
async function updateStockMagasinVenteCodeMagasin(codemagasin, items, transaction = null) {
    const magasin = await verifierExistence(Magasin, codemagasin, "Magasin", [], transaction, "code");
    await updateStockMagasinVente(magasin.depotstockage, items, transaction);
}


module.exports = {
    updateStockMagasin,
    updateStockMagasinVente,
    updateStockMagasinVenteCodeMagasin
};
