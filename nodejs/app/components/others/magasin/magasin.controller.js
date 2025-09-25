const { sendError } = require("../../../helpers/helpers.helper");
const { getAllMagasins } = require("./services/magasin.service");
const magasinService = require("./services/magasin-crud.service");
const { verifierAccesConnecte } = require("../../../services/acces/fonctionnalite.service");

const AccesMagasin = {
    create: 16,
    update: 17,
    view: 18
}

exports.getAllMagasins = async (req, res) => {
    try{
        const resp = await getAllMagasins();
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.create = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMagasin.create, req, res))
            return;   
        let resp = await magasinService.createMagasin(req.body);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.update = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMagasin.update, req, res))
            return;   
        let resp = await magasinService.updateMagasin(req.params.id, req.body);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.list = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMagasin.view, req, res))
            return;   
        let resp = await magasinService.getListMagasin(req);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.findById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMagasin.view, req, res))
            return;   
        let resp = await magasinService.findById(req.params.id);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

exports.updateModePaiement = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMagasin.update, req, res))
            return;   
        let resp = await magasinService.updateModePaiement(req.params.id, req.body);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.findAllMagasin = async (req, res) => {
    try{
        let resp = await magasinService.findAllMagasin();
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.findAllMagasinGifi = async (req, res) => {
    try{
        let resp = await magasinService.findAllMagasinGifi();
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

exports.findAllMagasinUser = async (req, res) => {
    try{
        let resp = await magasinService.findAllMagasinUser(req.user);
        res.send(resp);
    }
    catch(err){
                console.error("Erreur findAllMagasinUser:", err); // utile pour debug

        res.status(500).send({message: err.message})
    }
};

exports.getCaisses = async (req, res) => {
    try{
        let resp = await magasinService.getCaisses(req.params.id);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

exports.updateEmailDepot = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesMagasin.update, req, res))
            return;   
        await magasinService.updateEmailDepot(req.params.id, req.body.email);
        res.send({message: "Modifié"});
    }
    catch(err){
        sendError(res, err)
    }
};

exports.getAllDepots = async (req, res) => {
    try{ 
        const resp = await magasinService.getAllDepots();
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};



exports.findMagasinByIdentifiant = async (req, res) => {
    try{ 
        const resp = await magasinService.findMagasinByIdentifiant(req.params.identifiant);
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};

exports.getModePaiements = async (req, res) => {
    try{ 
        const resp = await magasinService.getModePaiements(req.params.identifiant);
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};


exports.getMonnaies = async (req, res) => {
    try{ 
        const resp = await magasinService.getAllMonnaies();
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};
