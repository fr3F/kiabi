const { sendError } = require("../../../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../../../services/acces/fonctionnalite.service");
const parametrageService = require("./services/parametrage.service");
const carteService = require("./services/carte-vip.service");
const { getListClientVip } = require("../../../../services/gifi/client-vip/client-vip.service");
const { updatePoint } = require("./services/update.service");
const { loggerGlobal } = require("../../../../helpers/logger");
const { getTicketsToRegularize } = require("./services/regularisation.service");

const ACCES_CARTE_VIP = {
    view: 23,
    manage: 28,
    regularize: 30,
}

exports.updateParametrage = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_CARTE_VIP.manage, req, res))
            return;   
        await parametrageService.updateParametrage(req.body, req.userId)
        res.send({message: "Updated"});
    }
    catch(err){
        sendError(res, err);
    }
};

exports.findParametrage = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_CARTE_VIP.manage, req, res))
            return;   
        const parametrage = await parametrageService.findExistParametrage()
        res.send({parametrage});
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getHistoriquesParametrage = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_CARTE_VIP.manage, req, res))
            return;   
        const historiques = await parametrageService.getHistoriquesParametrage();
        res.send(historiques);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.addPoint = async (req, res) => {
    try{
        const resp = await carteService.addPoint(req.body);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.updatePoint = async (req, res) => {
    try{
        loggerGlobal.info(`Carte VIP - Update point ${JSON.stringify(req.body)}`);
        const resp = await updatePoint(req.body);
        res.send(resp);
    }
    catch(err){
        loggerGlobal.error(`Carte VIP`);
        loggerGlobal.error(err.stack);
        sendError(res, err);
    }
};

exports.getPoint = async (req, res) => {
    try{
        const resp = await carteService.getPointClient(req.query.numClient);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.usePoint = async (req, res) => {
    try{
        const resp = await carteService.usePoint(req.body);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.resetPoint = async (req, res) => {
    try{
        const resp = await carteService.resetPointAllClient();
        res.send({message: "Initialized"});
    }
    catch(err){
        sendError(res, err);
    }
};

exports.list = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_CARTE_VIP.view, req, res))
            return;   
        let resp = await getListClientVip(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};



exports.getHistoriquesConso = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_CARTE_VIP.view, req, res))
            return;   
        let resp = await carteService.getHistoriquesConso(req.query.numClient);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getTicketsToRegularize = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_CARTE_VIP.regularize, req, res))
            return;   
        let resp = await getTicketsToRegularize(req.query.numClient);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};
