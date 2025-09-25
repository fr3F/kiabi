const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const { getControleTicketMagasin, getControleTicketCaisse } = require("../../services/reporting/controle.service");

exports.getControleTicketMagasin = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(46, req, res))
            return;   
        const resp = await getControleTicketMagasin(req.query.date);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.getControleTicketCaisse = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(62, req, res))
            return;   
        const resp = await getControleTicketCaisse(req.params.idMagasin, req.query.date);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};
