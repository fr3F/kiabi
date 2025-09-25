const { Op } = require("sequelize");
const { dataToJson, getPagingData, getVarNecessairePagination, getFiltreRecherche } = require("../../../helpers/helpers.helper");
const { CatCatalog, ClsCodification } = require("../../../models");

// List with pagination, and criteria
async function getListCatalogs(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    let option = await getOptionGetCatalog(req, limit, offset);
    let rep = await CatCatalog.findAndCountAll(option);
    rep = dataToJson(rep);
    return getPagingData(rep, page, limit)
};

async function getOptionGetCatalog(req, limit, offset){
    let filters = await getFiltreRechercheCatalog(req);
    let order = [['createdAt', 'DESC']];
    return {
        where: filters,
        limit, offset,
        order
    };
}

async function getListCatalogsByCodeEAN(codeEANArray) {
  try {
    const tags = await CatCatalog.findAll({
      where: {
        EANcode: {
          [Op.in]: codeEANArray
        }
      }
    });

    console.log("tags",tags);


    return tags.map(t => t.get({ plain: true }));
  } catch (error) {
    console.error('Erreur lors de la récupération des catalogues :', error);
    return [];
  }
}


// const { Op } = require("sequelize");

// async function getListCatalogsByCodeEAN(codeEANArray) {
//   const tags = await CatCatalog.findAll({
//     where: {
//       CodeEAN: {
//         [Op.in]: codeEANArray
//       }
//     }
//   });
//   return tags.map(t => t.dataValues);
// }

async function getFiltreRechercheCatalog(req){
    let filters = getFiltreRecherche(req, ["eanCode", "theme", "detailedProductDescription", "itemCode"]);
    if(!req.query.search)
        filters = {};
    const { clsType, clsValue, search } = req.query;
    await addCLSToFilters(filters, clsType, clsValue, search)
    return filters;
}

async function addCLSToFilters(filters, clsType, clsValue, search) {
    if(!clsType && !search)
        filters.id = {[Op.is]: null};
    const classes = await getCLSClasses(clsValue, clsType);
    if(classes.length){
        filters.theme = {[Op.in]: classes};
    }
}

async function getCLSClasses(clsValue, clsType) {
    if(!clsType)
        return [];
    const where = {};
    where[clsType] = clsValue; 
    const codifications = await ClsCodification.findAll({
        where
    });
    return codifications.map((r)=> r.class);
}

module.exports = {
    getListCatalogs,
    getListCatalogsByCodeEAN
}