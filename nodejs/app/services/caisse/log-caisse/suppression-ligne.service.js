const { logCaisse: LogCaisse } = require("../../../models");
const { findMagasinAndVerifyDate, getConditionCombined, LOG_MESSAGE, generateExcelArticles } = require("./util.service");


async function generateExcelSuprressionLigne(idMagasin, date) {
    const items = await getArticlesSuppressionLigne(idMagasin, date);
    return generateExcelArticles(items, LOG_MESSAGE.suppressionLigne);
}

async function getArticlesSuppressionLigne(idMagasin, date) {
    const magasin = await findMagasinAndVerifyDate(idMagasin, date);   
    const dataBrut = await getDataBrut(magasin, date);
    return getArticleFromDataBrut(dataBrut);
}

async function getDataBrut(magasin, date){
    const where = getConditionCombined(magasin, date, LOG_MESSAGE.suppressionLigne);
    return await LogCaisse.findAll({ where });
}

function getArticleFromDataBrut(data){
    const resp = [];
    for(const item of data){
        const article = generateArticle(JSON.parse(item.meta));
        addArticleToList(article, resp);
    }
    return resp;
}

function generateArticle(meta){
    if(meta.articles && meta.articles.length > 0)
        return generateArticleFromArray(meta);
    const { code, designation } = getCodeAndDesignation(meta);
    return { 
        code, 
        designation,
        gamme: meta.gamme, 
        quantite: meta.quantite,
        nocaisse: meta.numerocaisse,
    };
}

function generateArticleFromArray(meta){
    const articles = meta.articles;
    const article = articles[0];
    article.designation = article.fulldesignation;
    article.nocaisse = meta.numerocaisse;
    return article;
}

function getCodeAndDesignation(meta){
    const articleStr = meta.article;
    const code = articleStr.split(" - ")[0];
    const designation = articleStr.replace(`${code} - `, '');
    return { code, designation };
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
    getArticlesSuppressionLigne,
    generateExcelSuprressionLigne
}