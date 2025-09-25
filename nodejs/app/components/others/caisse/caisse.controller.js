const caisseService = require('./services/caisse.service');
const helper = require("./../../../helpers/helpers.helper");
const { verifierAccesConnecte } = require('../../../services/acces/fonctionnalite.service');

const AccesCaisse = {
    create: 19,
    update: 20
}

exports.createCaisse = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(AccesCaisse.create, req, res))
            return;  
        let rep = await caisseService.createCaisse(req.body); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

exports.updateCaisse = async (req, res) => {
    try{    
        if(!await verifierAccesConnecte(AccesCaisse.update, req, res))
            return;  
        let rep = await caisseService.updateCaisse(req.params.id,req.body); 
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

