const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const { deleteEncaissement } = require("../../services/cloture/encaissement.service");
const { imprimerReglement } = require("../../services/cloture/impression.service");
const validationService = require("./../../services/cloture/validation.service")

exports.getEncaissementAvalider = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(34, req, res))
            return;   
        let resp = await validationService.getEncaissementAvalider(req.params.id, req.query.date);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};

exports.getDetailEncaissementAValider = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(34, req, res))
            return;   
        let resp = await validationService.getDetailEncaissementAValider(req.params.id);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.imprimerReglements = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(36, req, res))
            return;   
        await imprimerReglement(req.params.id, req.user, res);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.valider = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(34, req, res))
            return;   
        let resp = await validationService.valider(req.params.id, req.body.motif, req.body.especeRecu, req.user);
        res.send({message: "Validé"});
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};

exports.deleteEncaissement = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(59, req, res))
            return;   
        let resp = await deleteEncaissement(req.params.id);

        res.send({message: "Deleted"});
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


