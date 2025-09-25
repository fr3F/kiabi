const { sendError } = require("../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const { getListCatalogs, getListCatalogsByCodeEAN } = require("./services/catalog.service");
const { getHierarchicalStructureCls } = require("./services/codification-tree.service");
const codificationService = require("./services/codification.service")

const AccesCatalog = {
    view: 11
}

exports.getAllGroups = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesCatalog.view, req, res))
            return;  
        const resp = codificationService.getAllGroups();
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getAllMarkets = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesCatalog.view, req, res))
            return;  
        const { group } = req.query;
        const resp = codificationService.getAllMarkets(group);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getAllDepartments = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesCatalog.view, req, res))
            return;  
        const { group, market } = req.query;
        const resp = codificationService.getAllDepartments(group, market);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getAllClasses = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesCatalog.view, req, res))
            return;  
        const { group, market, department } = req.query;
        const resp = codificationService.getAllClasses(group, market, department);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};


exports.getCLSHierrarchies = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesCatalog.view, req, res))
            return;  
        const resp = await getHierarchicalStructureCls()
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};



exports.getListCatalogs = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesCatalog.view, req, res))
            return;  
        const resp = await getListCatalogs(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getListCatalogsByCodeEAN = async (req, res) => {
  try {
    await verifierAccesConnecte(AccesCatalog.view, req, res);

    // Récupérer le paramètre codeEAN depuis query ou body
    let codeEANParam = req.query.codeEAN || req.body.codeEAN;

    if (!codeEANParam || codeEANParam.length === 0) {
      return res.status(400).json({ message: "Paramètre 'codeEAN' requis" });
    }

    // Convertir le paramètre en tableau si nécessaire
    const codeEANArray = Array.isArray(codeEANParam)
      ? codeEANParam
      : codeEANParam.split(',').map(ean => ean.trim()).filter(ean => ean);

    if (codeEANArray.length === 0) {
      return res.status(400).json({ message: "Le paramètre 'codeEAN' ne contient aucune valeur valide." });
    }

    // Appeler le service de récupération
    const tags = await getListCatalogsByCodeEAN(codeEANArray);
    
    // Répondre avec les résultats
    res.status(200).json(tags);
  } catch (err) {
    // Gestion d’erreur centralisée
    sendError(res, err);
  }
};
