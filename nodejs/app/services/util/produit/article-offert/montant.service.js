const { QueryTypes, Op } = require("sequelize");
const { selectSql } = require("../../../../helpers/db.helper");
const { validerRequete } = require("../../../../helpers/form.helper");
const { verifierExistence, formatDate, dataToJson, getVarNecessairePagination, getPagingData, getFiltreRecherche } = require("../../../../helpers/helpers.helper");
const { checkPrixArticleParCode } = require("../../check-prix.service");
const db = require("../../../../models");
const { ErrorCode } = require("../../../../helpers/error");
const { escape } = require("mysql2");
const { verifyDuplique } = require("./produit.service");
const ArticleOffert = db.articleOffert;
const Magasin = db.magasin;
const Produit = db.produit;



// Créer un article offert(montant)
// typemontant = 1
async function createArticleOffertMontant(data){ // {codePrincipal, code, gamme, quantiteOffert, debut, fin, magasins}(prends en charge la création pour plusieurs magasins)
    await verifyArticleOffert(data);
    const articles = await generateArticles(data);
    // await verifyPromoEnCours(data);
    await ArticleOffert.bulkCreate(articles)
}

// Vérifier l'objet envoyé, et generer les articles offerts pour un magasin selectionné
async function verifyArticleOffert(data){
    verifyRegle(data);
    const attrs = ["montantmin", "debut", "fin", "regle"];
    const nameAttrs = ["Montant minimum", "Début", "Fin", "regle"];
    const typeAttrs = ["nb", "date", "date"];
    validerRequete(data, attrs, nameAttrs, typeAttrs);
    if(!Array.isArray(data.articles) || !data.articles.length)
        throw new Error("Veuillez renseigner au moins un article");
    if(new Date(data.debut) >= new Date(data.fin))
        throw new Error("La date de début doit être avant la date de fin");
    await verifierExistence(Magasin, data.magasin, "Magasin", [], null, "nommagasin");
}

// Regle:  1 Entres, 2 Plus de
function verifyRegle(data){
    if(data.montantmin < 0)
        throw new ErrorCode("Veuillez renseigner un montant minimum positif non nul");
    if(data.regle == 1){
        if(isNaN(data.montantmax) || data.montantmin >= data.montantmax)
            throw new ErrorCode("Le montant maximum doit être superieur au montant minimum");
    }
    else if(data.regle == 2)
        data.montantmax = null;
    else
        throw new ErrorCode("Veuillez renseigner une règle valide");
}

async function generateArticles(data){
    const articles = [];
    for(const item of data.articles){
        const article = generateArticle(data, item);

        const existant = findArticle(article, articles); // Recherche dans la liste donnée
        if(existant)
            throw new Error(`L'article ${item.designationCode} est dupliqué dans la liste`);
  
        // const duplique = await verifyDuplique(article); // Recherche dans la base
        // if(duplique)
        //     throw new Error(`L'article ${item.designationCode} existe déjà pendant ces dates pour le magasin ` + data.magasin);
        articles.push(article);
    }
    return articles;
}

function generateArticle(data, item){
    if(isNaN(item.quantiteOffert) || item.quantiteOffert <= 0)
        throw new ErrorCode("Veuillez renseigner des quantité positives")
    return {
        debut: data.debut,
        fin: data.fin,
        typemontant: 1,
        montantmin: data.montantmin,
        montantmax: data.montantmax,
        supprime: false,
        code: item.code,
        gamme: item.gamme,
        agno: item.agno,
        quantiteOffert: item.quantiteOffert,
        magasin: data.magasin,
        dateModification: new Date()
    }
}


  // Pour chercher si il y a un article existant dans la liste
  function findArticle(newArticle, articles){
    if(newArticle.gamme)
      return articles.find((r)=> r.code == newArticle.code && r.gamme && toUpperCase(r.gamme) == toUpperCase(newArticle.gamme));
    return articles.find((r)=> r.code == newArticle.code && !r.gamme);
  }

  function toUpperCase(str){
    return str.toString().toUpperCase().trim();
  }

function getOptionGetListMontant(req, limit, offset){
    const include = ["produit"];
    const where = getFiltreRechercheMontant(req);
    return {include, limit, offset, where};
}


function getFiltreRechercheMontant(req){
    let filters = getFiltreRecherche(req, ["code", "$produit.fulldesignation$"]);
    if(!req.query.search)
        filters = {};
    filters.supprime = false;
    // filters.fin = {[Op.gte]: new Date()}
    filters.typemontant = 1;
    filters.codePrincipal = {[Op.is]: null};
    return filters;
}

async function getArticleOffertsMontants(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    let option = getOptionGetListMontant(req, limit, offset);
    let rep = await ArticleOffert.findAndCountAll(option);
    rep = dataToJson(rep);
    return getPagingData(rep, page, limit)
};

module.exports = {
    createArticleOffertMontant,
    getArticleOffertsMontants
}