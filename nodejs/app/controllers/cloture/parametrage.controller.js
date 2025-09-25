const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const parametrageService = require("../../services/cloture/parametrage.service")
const helper = require('../../helpers/helpers.helper');

exports.create = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(94, req, res))
            return;   
        let resp = await parametrageService.createParametrageCloture(req.body);
        res.send(resp);
    }
    catch(err){
        helper.sendError(err);
    }
};


exports.update = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(94, req, res))
            return;   
        let resp = await parametrageService.updateParametrageCloture(req.params.id, req.body);
        res.send(resp);
    }
    catch(err){
        helper.sendError(err);
    }
};


exports.list = async (req, res) => {
    try{
        let resp = await parametrageService.getListParametrageCloture(req);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        helper.sendError(err);
    }
};


exports.findById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(94, req, res))
            return;   
        let resp = await parametrageService.findById(req.params.id);
        res.send(resp);
    }
    catch(err){
        helper.sendError(err);
    }
};


exports.delete = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(94, req, res))
            return;   
        await parametrageService.deleteParametrageCloture(req.params.id);
        res.send({message: "Deleted"});
    }
    catch(err){
        helper.sendError(err);
    }
};




exports.getMagasins = async (req, res) => {
    try{
        let resp = await parametrageService.getMagasinsParametrage();
        res.send(resp);
    }
    catch(err){
        helper.sendError(err);
    }
};