const { sequelize, ReferentielSite } = require("../../../../../models");
const { findProductByReference } = require("./product.service");
const { prestashopAPI } = require("./util");

async function getReferentielsSiteByCode(code) {
    const product = await findProductByReference(code);
    const { gammes, gammesvalues, stockavalaibles } = getAssociations(product);
    if(gammes)
        return await getReferentielsWithGammes(product, gammes, gammesvalues, stockavalaibles);
    return getReferentielsWithoutGammes(product, stockavalaibles);
}

function getAssociations(product) {
    const gammes = product.associations.combinations;
    const gammesvalues = product.associations.product_option_values;
    const stockavalaibles = product.associations.stock_availables;
    return { gammes, gammesvalues, stockavalaibles };
}

async function getReferentielsWithGammes(product, gammes, gammesValues, stockavalaibles){
    const resp = [];
    for(let i = 0; i < gammes.length; i++){
        const tmp = await generateReferentielWithGamme(product, gammes[i], gammesValues[i], stockavalaibles);
        resp.push(tmp);
    }
    return resp;
}

async function generateReferentielWithGamme(product, gamme, gammeValue, stockavalaibles){
    const stock = findStockByGamme(gamme, stockavalaibles);
    const gammeValueFull = await getProductOptionValue(gammeValue.id);
    return generateReferentielObject(product, gammeValueFull, stock)
}

const getProductOptionValue = async (id) => {  
    const response = await prestashopAPI.productOptionValues.get(id);
    const productsOptionValue = response.data;
    return productsOptionValue;
};

function findStockByGamme(gamme, stockavalaibles){
    return stockavalaibles.find((stock)=> stock.id_product_attribute == gamme.id);
}

function getReferentielsWithoutGammes(product, stockavalaibles){
    const stock = stockavalaibles[0];
    const resp = generateReferentielObject(product, null, stock);
    return [resp];
}

function generateReferentielObject(product, gammeValueFull, stock){
    return {
        reference: product.reference,
        gamme: gammeValueFull? gammeValueFull.name: null,
        idProduitSite: product.id,
        idStockSite: stock.id
    };
}

async function updateReferentielsByCode(code) {
    const referentiels = await getReferentielsSiteByCode(code);    
    if(referentiels.length)
        await insertReferentielsToDb(code, referentiels);
}

async function insertReferentielsToDb(code, referentiels) {
    await sequelize.transaction(async (transaction)=>{
        await ReferentielSite.destroy({where: {reference: code}, transaction });
        await ReferentielSite.bulkCreate(referentiels, { transaction });
    })    
}

module.exports = {
    getReferentielsSiteByCode,
    updateReferentielsByCode
}
