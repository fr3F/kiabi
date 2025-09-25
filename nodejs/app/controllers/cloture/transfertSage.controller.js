const { loggerFiles } = require("../../helpers/logger");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const { exporterReglement } = require("../../services/cloture/file-reglement.service");
const { exporterFichierSage, exporterExcelTicket, exporterFichierSql } = require("../../services/cloture/file.service");
const { envoyerMailSage } = require("../../services/cloture/mail.service");
const transfertService = require("./../../services/cloture/transfert-sage.service")

exports.getEncaissementARegulariser = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(35, req, res))
            return;   
        let resp = await transfertService.getEncaissementARegulariser(req.query.date, req.query.idParametrage);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.getResumeJour = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(35, req, res))
            return;   
        let resp = await transfertService.getResumeJour(req.query.date, req.query.idParametrage);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.getSommaireReglement = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(35, req, res))
            return;   
        let resp = await transfertService.getSommaireReglement(req.query.date, req.query.idParametrage);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};



exports.getSommaireReglementMagasin = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(46, req, res))
            return;   
        let resp = await transfertService.getSommaireReglementMagasin(req.query.date, req.params.idMagasin);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.exporterSage = async (req, res) => {
    try{   
        await exporterFichierSage(req.query.date, req.query.idParametrage, res);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.exporterSql = async (req, res) => {
    try{   
        await exporterFichierSql(req.query.date, res);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.exporterReglement = async (req, res) => {
    try{   
        await exporterReglement(req.query.date, req.query.idParametrage, res);
    }
    catch(err){
        loggerFiles.error(err);
        loggerFiles.error(err.stack);
        res.status(500).send({message: err.message})
    }
}

exports.sendMail = async (req, res) => {
    try{   
        await envoyerMailSage(req.query.date, req.query.idParametrage);
        res.send({message: "Mail envoyé"});
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.getDetailTicketJourMagasin = async (req, res) => {
    try{   
        if(!await verifierAccesConnecte(37, req, res))
            return;   
        const {date, magasin, client} = req.query;
        const resp = await transfertService.getDetailTicketJourMagasin(date, magasin, client);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}


exports.exporterExcelTicket = async (req, res) => {
    try{   
        if(!await verifierAccesConnecte(38, req, res))
            return;   
        const {date, magasin, client} = req.query;
        await exporterExcelTicket(date, magasin, client, res);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}