const { Op } = require("sequelize");
const { getVarNecessairePagination, dataToJson, getPagingData, getFiltreRecherche } = require("../../../helpers/helpers.helper");
const db = require("./../../../models");
const RemiseMagasin = db.remisemagasin;

function getOptionGetList(req, limit, offset){
    const include = []
    // const include = ["produit"];
    const where = getFiltreRechercheRemise(req);
    return {include, limit, offset, where};
}


function getFiltreRechercheRemise(req){
    // let filters = getFiltreRecherche(req, ["AR_Ref"]);
    // let filters = getFiltreRecherche(req, ["AR_Ref", "$produit.fulldesignation$", "CT_Num"]);
    let filters = getFiltreRecherche(req, ["AR_Ref", "CT_Num"]);
    if(!req.query.search)
        filters = {};
    return filters;
}

async function getRemiseMagasins(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    let option = getOptionGetList(req, limit, offset);
    let rep = await RemiseMagasin.findAndCountAll(option);
    rep = dataToJson(rep);
    await setProduitRemises(rep.rows)
    await setMagasinRemises(rep.rows);
    return getPagingData(rep, page, limit)
};

async function setMagasinRemises(data){
    const magasins = await db.magasin.findAll();
    for(const item of data)
        item.magasin = magasins.find((r)=> r.identifiant == item.CT_Num);
}

async function setProduitRemises(data){
    const codes = data.map((r)=> r.AR_Ref).filter((r)=> r);
    if(!codes.length)
        return;
    const produits = await db.produit.findAll({where: {code: {[Op.in]: codes}}});
    for(const item of data)
        item.produit = produits.find((r)=> r.code == item.AR_Ref);
}


module.exports = {
    getRemiseMagasins
}