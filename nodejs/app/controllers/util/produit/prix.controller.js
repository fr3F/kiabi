

const updateService = require("../../../services/util/produit/update-prix/update-prix.service");
const updateTarifService = require("../../../services/util/produit/update-prix/update-tarif-magasin.service");
const historyService = require("../../../services/util/produit/update-prix/historique.service");
const exportService = require("../../../services/util/produit/update-prix/export-sage.service");

const { verifierAccesConnecte } = require("../../../services/acces/fonctionnalite.service");
const { setHeaderResponseAttachementPdf, sendError } = require("../../../helpers/helpers.helper");

const ACCES_PRIX = {
    update: 171,
    history: 172,
    exportSage: 173 
}

exports.updatePrixFromFile = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRIX.update, req, res))
            return;   
        const invalidCodes = await updateService.updatePrixProduitFromFile(req.body.file, req.userId);
        res.send({invalidCodes});
    }
    catch(err){
        sendError(res, err);
    }
};

exports.updateTarifMagasinFromFile = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRIX.update, req, res))
            return;   
        const invalidCodes = await updateTarifService.updateTarifMagasinFromFile(req.body.file, req.userId, req.body.idMagasin);
        res.send({invalidCodes});
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getListHistoriquePrix = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRIX.history, req, res))
            return;   
        const resp = await historyService.getListHistoriquePrix(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};


exports.findHistoriquePrixById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRIX.history, req, res))
            return;   
        const resp = await historyService.findHistoriquePrixById(req.params.id);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};




exports.exportHistoriqueSage = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRIX.exportSage, req, res))
            return;   
        const content = await exportService.exportHistoriqueUpdatePrix(req.params.id);
        res.send(content);
    }
    catch(err){
        sendError(res, err);
    }
};



