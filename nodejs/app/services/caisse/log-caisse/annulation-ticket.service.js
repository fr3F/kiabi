const { logCaisse: LogCaisse } = require("../../../models");
const { findMagasinAndVerifyDate, getConditionCombined, LOG_MESSAGE, generateExcelArticles } = require("./util.service");

async function generateExcelAnnulationTicket(idMagasin, date) {
    const items = await getArticlesAnnulationTicket(idMagasin, date);
    return generateExcelArticles(items, LOG_MESSAGE.annulationTicket);
}

async function getArticlesAnnulationTicket(idMagasin, date) {
    const magasin = await findMagasinAndVerifyDate(idMagasin, date);   
    const dataBrut = await getDataBrut(magasin, date);
    return getArticleFromDataBrut(dataBrut);
}

async function getDataBrut(magasin, date){
    const where = getConditionCombined(magasin, date, LOG_MESSAGE.annulationTicket);
    return await LogCaisse.findAll({ where });
}

function getArticleFromDataBrut(data){
    const resp = [];
    for(const item of data){
        addArticleFromItem(item, resp);
    }
    return resp;
}

function addArticleFromItem(item, list){
    const meta = JSON.parse(item.meta);
    if(meta.articles){
        for(const articleBrut of meta.articles){
            const article = generateArticle(articleBrut, meta.numerocaisse);
            addArticleToList(article, list);
        }
    }
}

function generateArticle(article, nocaisse){
    return { 
        code: article.code, 
        designation: article.fulldesignation?? article.designation,
        gamme: article.gamme, 
        quantite: article.quantite,
        nocaisse,
    };
}

function addArticleToList(article, list){
    if(!article.code)
        return;
    const exist = findExistingArticle(article, list);
    if(!exist)
        list.push(article);
    else
        exist.quantite += article.quantite;
}

function findExistingArticle(article, list){
    return list.find((r)=> article.code == r.code && article.gamme == r.gamme && article.nocaisse == r.nocaisse );
}

module.exports = {
    getArticlesAnnulationTicket,
    generateExcelAnnulationTicket
}