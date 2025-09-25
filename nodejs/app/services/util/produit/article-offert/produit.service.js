const { QueryTypes, Op } = require("sequelize");
const { selectSql } = require("../../../../helpers/db.helper");
const { validerRequete } = require("../../../../helpers/form.helper");
const { verifierExistence, formatDate, dataToJson, getVarNecessairePagination, getPagingData, getFiltreRecherche } = require("../../../../helpers/helpers.helper");
const { checkPrixArticleParCode } = require("../../check-prix.service");
const db = require("../../../../models");
const { ErrorCode } = require("../../../../helpers/error");
const { escape } = require("mysql2");
const ArticleOffert = db.articleOffert;
const Magasin = db.magasin;
const Produit = db.produit;

const TABLE = "articleofferts";

// Créer un article offer
// typemontant = 0
async function createArticleOffertProduit(data){ // {codePrincipal, code, gamme, quantiteOffert, debut, fin, magasins}(prends en charge la création pour plusieurs magasins)
    data = await verifyArticleOffert(data);
    // await verifyPromoEnCours(data);
    await ArticleOffert.bulkCreate(data)
}


// Supprimer un article offert
async function deleteArticleOffert(id){ 
    const article = await verifierExistence(ArticleOffert, id, "Article offert");
    if(article.supprime)
        throw new Error("Cet article est déjà supprimé");
    await ArticleOffert.update({supprime: true}, {where: {id}});

}
// Vérifier si il y a des promotions pour l'article dans le magasin(ou remise, ou baremes)
async function verifyPromoEnCours(data){
    const prix = await checkPrixArticleParCode(data.codePrincipal, data.idMagasin);
    if(!prix)
        throw new Error("Article introuvable");
    if(prix.promo || prix.tauxremisesage || prix.estvip || prix.estRemise)
        throw new Error("Cet article a encore des remises/promotions/prix VIP pour ce magasin")
}

// Vérifier l'objet envoyé, et generer les articles offerts pour chaque magasin selectionné
async function verifyArticleOffert(data){
    if(!data.magasins || !Array.isArray(data.magasins))
        throw new Error("Veuillez renseigner au moins un magasin")
    const magasins = data.magasins;
    const attrs = ["codePrincipal", "code", "quantiteOffert", "debut", "fin"];
    const nameAttrs = ["Code principal", "Code", "Quantité offerte", "Début", "Fin"];
    const typeAttrs = ["str", "str", "nb", "date", "date"];
    validerRequete(data, attrs, nameAttrs, typeAttrs);
    if(data.quantiteOffert <= 0)
        throw new Error("Veuillez renseigner une quantité positive");
    if(new Date(data.debut) >= new Date(data.fin))
        throw new Error("La date de début doit être avant la date de fin");
    data.produit = await verifierExistence(Produit, data.code, "Article offert", [], null, "code");
    return await generateArticleOffertMagasins(magasins, data);
}

async function generateArticleOffertMagasins(magasins, data){
    const resp = []
    for(let mag of magasins){
        const tmp = {...data};
        const magasin = await verifierExistence(Magasin, mag, "Magasin", [], null, "nommagasin");
        tmp.idMagasin = magasin.id; 
        tmp.magasinObj = magasin;
        tmp.magasin = mag;
        tmp.typemontant = 0;
        const duplique = await verifyDuplique(tmp);
        if(duplique)
            throw new Error("Il existe déjà un article offert pour ces informations pendant ces dates pour le magasin " + data.magasinObj.nommagasin);
        resp.push(tmp);    
    }        
    return resp;
}

// Vérifier si il existe un article offert pour une date et magasin
async function verifyDuplique(data){
    const format = "YYYY-MM-DD HH:mm:ss";
    const debut = formatDate(data.debut, format);
    const fin = formatDate(data.fin, format);
    const sql = `SELECT * FROM articleofferts
                    WHERE magasin = '${data.magasin}' 
                        ${data.codePrincipal? 
                            `AND codePrincipal = ${escape(data.codePrincipal)}`
                            : ' AND codePrincipal IS NULL '}
                        AND code = ${escape(data.code)}
                        AND COALESCE(gamme, '') = ${escape(data.gamme??'')}
                        AND supprime IS FALSE
                        AND (
                            (debut BETWEEN '${debut}' AND '${fin}')
                            OR (fin BETWEEN '${debut}' AND '${fin}')
                            OR ('${debut}' BETWEEN debut AND fin)
                            OR ('${fin}' BETWEEN debut AND fin)
                        ) LIMIT 1`;
    const resp = await selectSql(sql);
    return resp.length != 0;
}

async function setMagasinArticleOfferts(data){
    const magasins = await Magasin.findAll();
    for(const item of data)
        item.magasinObj = magasins.find((r)=> r.identifiant == item.magasin);
}

// function getOptionGetListProduct(req, limit, offset){
//     const attributes = [
//          [Sequelize.fn('DISTINCT', Sequelize.col('codePrincipal')), 'codePrincipal'],
//         'magasin', 
//         'produitPrincipal'
//       ];
//     const include = ["produitPrincipal"];
//     const where = getFiltreRechercheProduit(req);
//     return {include, limit, offset, where, attributes};
// }


// function getFiltreRechercheProduit(req){
//     let filters = getFiltreRecherche(req, ["$produitPrincipal.code$", "$produitPrincipal.fulldesignation$"]);
//     if(!req.query.search)
//         filters = {};
//     filters.supprime = false;
//     filters.codePrincipal = {[Op.not]: null};
//     return filters;
// }

// async function getProductWithArticleOfferts(req){
//     let { page, limit, offset } = getVarNecessairePagination(req);
//     let option = getOptionGetListProduct(req, limit, offset);
//     let rep = await ArticleOffert.findAndCountAll(option);
//     rep = dataToJson(rep);
//     return getPagingData(rep, page, limit)
// };

// Recuperer les articles offerts d'un produit, par magasin
async function getArticleOffertsProduitMagasin(codePrincipal, magasin){
    if(!codePrincipal)
        throw new ErrorCode("Veuillez renseigner le code principal");
    if(!magasin)
        throw new ErrorCode("Veuillez renseigner le magasin");
    return await ArticleOffert.findAll({
        where: {codePrincipal, magasin, supprime: false},
        include: ["produit"]
    });
}

// En utilisant des requetes sql
async function getProductWithArticleOfferts(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    const sql = makeSqlList(req.query.search);
    const count = await getCountList(req.query.search);
      // Utilisation de Sequelize pour inclure les associations
    const results = await db.sequelize.query(sql, {
        replacements: { limit, offset },
        type: QueryTypes.SELECT,
        model: ArticleOffert, // spécifier le modèle pour Sequelize
        mapToModel: true, // mapper les résultats à des instances de modèle Sequelize
        raw: true
    });
    await setProduitPrincipals(results);
    return getPagingData({rows: results, count}, page, limit);
}

async function setProduitPrincipals(rows){
    if(!rows.length)
        return;
    const codes = rows.map((r)=> r.codePrincipal);
    const products = await Produit.findAll({where: {code: {[Op.in]: codes}}});
    for(const row of rows){
        row.produitPrincipal = products.find((r)=> r.code == row.codePrincipal);
    }
}

async function getCountList(search){
    const where = getConditionSQLList(search);
    const sql = `SELECT COUNT(DISTINCT codePrincipal, magasin) AS nb 
                    FROM ${TABLE}
                    WHERE ${where}`;
    const resp = await selectSql(sql);
    return resp.length? resp[0].nb: 0;
}

function getConditionSQLList(search){
    const resp = ` supprime = false AND codePrincipal IS NOT NULL AND fin > NOW() `;
    if(search)
        return resp + ' AND codePrincipal LIKE ' + escape('%' + search + '%');
    return resp;
}

function makeSqlList(search, limit = true){
    const where = getConditionSQLList(search);
    return `
        SELECT DISTINCT codePrincipal, magasin
            FROM ${TABLE}
            WHERE 
            ${where}
            LIMIT :limit OFFSET :offset
        `;
}
module.exports = {
    createArticleOffertProduit,
    setMagasinArticleOfferts,
    deleteArticleOffert,
    getProductWithArticleOfferts,
    getArticleOffertsProduitMagasin,
    verifyDuplique
}