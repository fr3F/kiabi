const { verifierAccesConnecte } = require("../../../../services/acces/fonctionnalite.service");
const modepaiementService = require("./services/modepaiement.service")

const AccesMode = {
    view: 21,
    manage :22
}

exports.create = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMode.manage, req, res))
            return;   
        let resp = await modepaiementService.createModepaiementStandard(req.body);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.update = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMode.manage, req, res))
            return;   
        let resp = await modepaiementService.updateModepaiementStandard(req.params.id, req.body);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.list = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMode.view, req, res))
            return;   
        let resp = await modepaiementService.getListModepaiementStandard(req);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.findById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMode.view, req, res))
            return;   
        let resp = await modepaiementService.findById(req.params.id);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.delete = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMode.manage, req, res))
            return;   
        await modepaiementService.deleteModepaiementStandard(req.params.id);
        res.send({message: "Deleted"});
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};