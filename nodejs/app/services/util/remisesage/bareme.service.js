const { Op } = require("sequelize");
const { getVarNecessairePagination, dataToJson, getPagingData, getFiltreRecherche } = require("../../../helpers/helpers.helper");
const db = require("./../../../models");
const BaremePourcentage = db.baremespourcentage;

function getOptionGetList(req, limit, offset){
    // const include = ["produit"];
    const include = []
    const where = getFiltreRechercheBareme(req);
    return {include, limit, offset, where};
}


function getFiltreRechercheBareme(req){
    // let filters = getFiltreRecherche(req, ["code", "$produit.fulldesignation$"]);
    let filters = getFiltreRecherche(req, ["code"]);
    if(!req.query.search)
        filters = {};
    return filters;
}

async function getBaremesPourcentages(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    let option = getOptionGetList(req, limit, offset);
    let rep = await BaremePourcentage.findAndCountAll(option);
    rep = dataToJson(rep);
    await setProduitBaremes(rep.rows);
    return getPagingData(rep, page, limit)
};


async function setProduitBaremes(data){
    const codes = data.map((r)=> r.code).filter((r)=> r);
    if(!codes.length)
        return;
    const produits = await db.produit.findAll({where: {code: {[Op.in]: codes}}});
    for(const item of data)
        item.produit = produits.find((r)=> r.code == item.code);
}

module.exports = {
    getBaremesPourcentages
}