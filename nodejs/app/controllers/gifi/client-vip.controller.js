const { sendLoyactFile } = require("../../components/others/marketing/loyact/services/file.service");
const { setHeaderResponseAttachementExcel } = require("../../helpers/excel.helper");
const { sendError } = require("../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const { activateCarteVip } = require("../../services/gifi/client-vip/activation.service");
const clientVipService = require("../../services/gifi/client-vip/client-vip.service");
const { sendClientFile } = require("../../services/gifi/client-vip/file.service");

const AccesClientVip = {
    create: 23,
    update: 24,
    view: 25,
    delete: 26,
    export: 27,
    activate: 29,
    regul: 30,
    sendKiabi: 31
}
	
exports.create = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.create, req, res))
            return;   
        let resp = await clientVipService.createClientVip(req.body, req.user.storeCode);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};


exports.update = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.update, req, res))
            return;   
        let resp = await clientVipService.updateClientVip(req.params.id, req.body);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};


exports.list = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.view, req, res))
            return;   
        let resp = await clientVipService.getListClientVip(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};


exports.findById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.view, req, res))
            return;   
        let resp = await clientVipService.findById(req.params.id);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};


exports.delete = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.delete, req, res))
            return;   
        await clientVipService.deleteClientVip(req.params.id);
        res.send({message: "Deleted"});
    }
    catch(err){
        sendError(res, err);
    }
};



exports.exportExcel = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.export, req, res))
            return;   
        await clientVipService.exporterExcelClientVIP(res);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.importExcel = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.create, req, res))
            return;   
        await clientVipService.importClientVIPExcel(req.body.file, req.user.storeCode);
        res.send({message: "Importé"});
    }
    catch(err){
        console.log(err)
        sendError(res, err);
    }
};

exports.activerCarte = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.activate, req, res))
            return;   
        const { moisValidation } = req.body;
        const resp = await activateCarteVip(req.params.id, moisValidation);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        sendError(res, err);
    }
};


exports.sendToKiabi = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesClientVip.sendKiabi, req, res))
            return;   
        await sendClientFile();
        await sendLoyactFile();
        res.send({message: "Sent"});
    }
    catch(err){
        sendError(res, err);
    }
};
