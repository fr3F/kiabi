const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const helper = require("./../../helpers/helpers.helper");

const logService = require("./../../services/caisse/log-caisse/log-caisse.service")
const supprService = require("./../../services/caisse/log-caisse/suppression-ligne.service")
const annulationService = require("./../../services/caisse/log-caisse/annulation-ticket.service");
const { setHeaderResponseAttachementExcel } = require("../../helpers/excel.helper");

const ACCES_LOG = {
    view: 95,
    suppressionLigne: 193,
    annulationTicket: 192,
}

exports.getLogCaisse = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(ACCES_LOG.view, req, res))
            return;  
        let rep = await logService.getLogCaisse(req.query.date, req.query.message, req.user); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.getLogCaisseGrouped = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(ACCES_LOG.view, req, res))
            return;  
        let rep = await logService.getLogCaisseGrouped(req.query.date, req.user); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.getArticlesSuppressionLigne = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(ACCES_LOG.suppressionLigne, req, res))
            return;  
        const { idMagasin, date } = req.query;
        const rep = await supprService.getArticlesSuppressionLigne(idMagasin, date); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.getArticlesAnnulationTicket = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(ACCES_LOG.annulationTicket, req, res))
            return;  
        const { idMagasin, date } = req.query;
        const rep = await annulationService.getArticlesAnnulationTicket(idMagasin, date); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.exportArticlesSuppressionLigne = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_LOG.suppressionLigne, req, res))
            return;   
        const { idMagasin, date } = req.query;
        const buffer = await supprService.generateExcelSuprressionLigne(idMagasin, date);
        const filename = `Suppression.xlsx`;
        setHeaderResponseAttachementExcel(res, filename);
        res.send(buffer);
    }
    catch(err){
        helper.sendError(res, err);
    }
};

exports.exportArticlesAnnulationTicket = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_LOG.annulationTicket, req, res))
            return;   
        const { idMagasin, date } = req.query;
        const buffer = await annulationService.generateExcelAnnulationTicket(idMagasin, date);
        const filename = `Annulation.xlsx`;
        setHeaderResponseAttachementExcel(res, filename);
        res.send(buffer);
    }
    catch(err){
        helper.sendError(res, err);
    }
};
