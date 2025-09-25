const { verifierExistence, getVarNecessairePagination, dataToJson, getPagingData, getFiltreRecherche } = require("../../../../helpers/helpers.helper");
const { ItemHistoriquePrix, HistoriquePrix } = require("../../../../models");

async function getHistoriquesPrixProduit(code){
    const includeHistorique = { model: HistoriquePrix, as: "historique", include: ["user", "magasin"]};
    const historiques = await ItemHistoriquePrix.findAll({
        where: {code},
        include: [includeHistorique],
        order: [["createdAt", "DESC"]]
    });
    return historiques;
}


// Recuperer historique Prix by id
async function findHistoriquePrixById(id){
    const include = ["items", "user", "magasin"];
    return await verifierExistence(HistoriquePrix, id, "Historique Prix", include);
}


// List with pagination, and criteria
async function getListHistoriquePrix(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    let option = getOptionGetHistoriquePrix(req, limit, offset);
    let rep = await HistoriquePrix.findAndCountAll(option);
    rep = dataToJson(rep);
    return getPagingData(rep, page, limit)
};

function getOptionGetHistoriquePrix(req, limit, offset){
    let filters = getFiltreRechercheHistoriquePrix(req);
    let order = [['createdAt', 'DESC']];
    const include = ["user", "magasin"];
    return {
        where: filters,
        limit, offset,
        order,
        include
    };
}

function getFiltreRechercheHistoriquePrix(req){
    let filters = getFiltreRecherche(req, ["$user.nom$", "$user.prenom$"]);
    if(!req.query.search)
        filters = {};
    return filters;
}

module.exports = {
    getHistoriquesPrixProduit,
    findHistoriquePrixById,
    getListHistoriquePrix
}