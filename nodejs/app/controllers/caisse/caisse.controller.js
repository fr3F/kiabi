const { loggerEncaissement } = require('../../helpers/logger');
const encaissementModel = require('../../models/vente/encaissement/encaissement.model');
const { verifierAccesConnecte } = require('../../services/acces/fonctionnalite.service');
const caisseService = require('../../services/caisse/caisse.service');
const { chargerTicketMagasin, chargerTicketMagasinByNoCaisse } = require('../../services/caisse/charger-magasin.service');
const { getTicketsCaisse, findTicketByIdFromCaisse } = require('../../services/caisse/consultation-ticket.service');
const { getArticleTicketsCaisse, exporterExcelVentesCaisses } = require('../../services/caisse/consultation.service');
// const { installCaisse } = require('../../services/caisse/install.service');
// const { reinstallCaisse, reinstallTable } = require('../../services/caisse/re-install.service');
// const { synchronizeCaisse, synchronizeCaisseNumero } = require('../../services/caisse/synchro.service');
// const { getJsonCaisse } = require('../../services/caisse/json-caisse.service');
const { getEncaissementsCaisse, chargerEncaissementCaisse, chargerEncaissementCaisse2, chargerEncaissementJSON,getAllEncaissements } = require('../../services/cloture/encaissement.service');
const helper = require("./../../helpers/helpers.helper");


//creer utilisateur ou caissier
exports.createUtilisateur = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(14, req, res))
            return;
        let rep = await caisseService.createUserCaissier(req.body);
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.createCaisse = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(14, req, res))
        return;  
        let rep = await caisseService.createCaisse(req.body); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.testConnexion = async (req, res) => {
    try{    
        await caisseService.testMySQLConnection(req.body); 
        res.send({message: "OK"})
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.testConnected = async (req, res) => {
    try{    
        let resp = await caisseService.testConnected(req.params.id);
        res.send(resp); 
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.updateCaisse = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(17, req, res))
        return;  
        let rep = await caisseService.updateCaisse(req.params.id,req.body); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}
// exports.exportJsonCaisse = async (req, res) => {
//     try{    
//         if(!await verifierAccesConnecte(15, req, res))
//             return;  
//         const jsonData = await getJsonCaisse(req.params.id);
//         const jsonContent = JSON.stringify(jsonData, null, 2);
//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Content-Disposition', 'attachment; filename=caisse.json');
//         res.send(jsonContent);
//     }
//     catch(err){
//         helper.sendError(res, err);
//     }
// }


// exports.installCaisse = async (req, res) => {
//     try{    
//         if(!await verifierAccesConnecte(16, req, res))
//             return;  
//         let resp = await installCaisse(req.params.id);
//         res.send(resp)
//     }
//     catch(err){
//         helper.sendError(res, err);
//     }
// }


// exports.synchronizeCaisse = async (req, res) => {
//     try{    
//         if(!await verifierAccesConnecte(18, req, res))
//             return;  
//         let resp = await synchronizeCaisse(req.params.id);
//         res.send({message: "OK"})
//     }
//     catch(err){
//         helper.sendError(res, err);
//     }
// }

// exports.synchronizeCaisseNumero = async (req, res) => {
//     try{    
//         await synchronizeCaisseNumero(req.body.nocaisse, req.body.codemagasin);
//         res.send({message: "OK"})
//     }
//     catch(err){
//         helper.sendError(res, err);
//     }
// }


// exports.reinstallCaisse = async (req, res) => {
//     try{    
//         if(!await verifierAccesConnecte(19, req, res))
//             return;  
//         let resp = await reinstallCaisse(req.params.id);
//         res.send({message: "OK"})
//     }
//     catch(err){
//         helper.sendError(res, err);
//     }
// }

// exports.reinstallTable = async (req, res) => {
//     try{    
//         if(!await verifierAccesConnecte(19, req, res))
//             return;  
//         await reinstallTable(req.params.id, req.params.idTableSynchro);
//         res.send({message: "OK"})
//     }
//     catch(err){
//         helper.sendError(res, err);
//     }
// }

exports.getEncaissementsCaisse = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(113, req, res))
            return;   
        let resp = await getEncaissementsCaisse(req.params.id, req.query.date);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.chargerEncaissementCaisse = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(112, req, res))
            return;   
        
        console.log("charger encaissement caisse", req.params.id, req.body.idencaissement);
        
        let resp = await chargerEncaissementCaisse(req.params.id, req.body.idencaissement);
        loggerEncaissement.info("Encaissement chargé");
        res.send(resp);
    }
    catch(err){
        console.log(err)
        loggerEncaissement.error(err);
        loggerEncaissement.error(err.stack);
        res.status(500).send({message: err.message})
    }
};

exports.chargerEncaissementJSON = async (req, res) => {
    try{
        let resp = await chargerEncaissementJSON(req.body);
        loggerEncaissement.info("Encaissement chargé");
        res.send(resp);
    }
    catch(err){
        console.log(err)
        loggerEncaissement.error(err);
        loggerEncaissement.error(err.stack);
        res.status(500).send({message: err.message})
    }
};

exports.getAllEncaissements =  async (req, res) => {
    try{
        let resp = await getAllEncaissements();
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }

}

exports.chargerEncaissementCaisse2 = async (req, res) => {
    try{

        console.log("---", req.body)
        
        let resp = await chargerEncaissementCaisse2(req.body.magasin, req.body.nocaisse, req.params.id);
        loggerEncaissement.info("Encaissement chargé");
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(400).send({message: err.message})
    }
};

exports.getArticleTicketsCaisse = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(115, req, res))
            return;   
        let resp = await getArticleTicketsCaisse(req.params.id, req.query.debut, req.query.fin, req.query.code, req.query.client);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};

// // Article ticket d'une caisse pour un code spécifique
exports.getArticleTicketsCaisseByCode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(115, req, res))
            return;   
        let list = await getArticleTicketsCaisse(req.params.id, req.query.debut, req.query.fin, req.params.code);
        res.send(list);
    }
    catch(err){
        helper.sendError(res, err, err.code);
    }
};


exports.exporterExcelVentesCaisses = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(114, req, res))
            return;   
        await exporterExcelVentesCaisses(req.params.id, req.query, res);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.getTicketsCaisse = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(114, req, res))
            return;   
        let resp = await getTicketsCaisse(req.params.id, req.query.debut, req.query.fin);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(400).send({message: err.message})
    }
};


exports.findTicketCaisseById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(117, req, res))
            return;   
        let resp = await findTicketByIdFromCaisse(req.params.idTicket, req.params.id);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(400).send({message: err.message})
    }
};

exports.chargerTicketMagasinById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(117, req, res))
            return;   
        let resp = await chargerTicketMagasin(req.params.idTicket, req.params.id, true);
        res.send({message: "Chargé"});
    }
    catch(err){
        console.log(err)
        res.status(400).send({message: err.message})
    }
};


exports.chargerTicketMagasinByNoCaisse = async (req, res) => {
    try{
        const { idticket, nocaisse, identifiantMagasin } = req.body
        let resp = await chargerTicketMagasinByNoCaisse(idticket, nocaisse, identifiantMagasin);
        res.send({message: "Chargé"});
    }
    catch(err){
        console.log(err)
        res.status(400).send({message: err.message})
    }
};