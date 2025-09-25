const { ErrorCode } = require("../../../../../helpers/error");
const { toUpperCaseComparaison } = require("../../../../../helpers/helpers.helper");
const { checkPrixArticleLSParCode } = require("../../../../../services/util/check-prix.service");
const { getStocksLS } = require("../../../../../services/util/produit/produit.service");
const { getMappingsByCode } = require("../site-web.service");
const { prestashopAPI } = require("./util");

const updateProductStock = async (id, quantity) => {
    const response = await prestashopAPI.stockAvailables.update(id, {
        id: id,
        quantity: quantity
    }); 
    return response;
};


const updateProductPrice = async (productId, price) => {
    const response = await prestashopAPI.products.update(productId, {
        id: productId,
        price: price,
        id_tax_rules_group:'10',
    }); 
    return response;
};

async function updateMappingsToSiteWeb(code) {
    const mappings = await getMappingsByCode(code);
    if(!mappings.length)
        throw new ErrorCode("Ce produit n'a pas de mapping")
    const stocks = await getStocksLS(code);
    const prix = await getPrixLSByCode(code);
    await updateMappingsToSiteWebCore(stocks, prix, mappings);
}


async function getPrixLSByCode(code) {
    const data = await checkPrixArticleLSParCode(code);    
    if(data.prixvip)
        return data.prixvip / (1 + data.produit.tauxtva/100);
    return data.prixht;
}

async function updateMappingsToSiteWebCore(stocks, prix, mappings) {
    await updateProductPrice(mappings[0].idProduitSite, prix)
    for(const mapping of mappings){
        await updateOneMapping(mapping, stocks);
    }    
}

async function updateOneMapping(mapping, stocks) {
    const stock = findStockForMapping(mapping, stocks);
    if(stock)
        await updateProductStock(mapping.idStockSite, stock.quantite);
}

function findStockForMapping(mapping, stocks){
    return stocks.find((r)=> toUpperCaseComparaison(mapping.gamme) == toUpperCaseComparaison(r.gamme));
}

  
module.exports = {
    updateProductPrice,
    updateProductStock,
    updateMappingsToSiteWeb
}