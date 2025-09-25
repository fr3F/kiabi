const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const devisService = require("../../services/parametrage/devis/devis.service");
const { duplicateDevis } = require("../../services/parametrage/devis/duplicate.service");
const { imprimerDevis } = require("../../services/parametrage/devis/impression.service");

exports.create = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(66, req, res))
            return;   
        const toutType = await verifierAccesConnecte(devisService.TOUT_TYPE_FONCTIONNALITE, req);
        let resp = await devisService.createDevis(req.body, req.userId, toutType);
        res.send(resp);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};

exports.duplicateDevis = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(66, req, res))
            return;   
        await duplicateDevis(req.params.id, req.userId, req.body.nombre);
        res.send({message: "Duplicated"});
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};


exports.update = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(67, req, res))
            return;   
        const toutType = await verifierAccesConnecte(devisService.TOUT_TYPE_FONCTIONNALITE, req);
        let resp = await devisService.updateDevis(req.params.id, req.body, toutType);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.list = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(65, req, res))
            return;   
        let resp = await devisService.getListDevis(req);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.findById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(65, req, res))
            return;   
        let resp = await devisService.findById(req.params.id);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.delete = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(68, req, res))
            return;   
        await devisService.deleteDevis(req.params.id);
        res.send({message: "Deleted"});
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};



exports.searchClient = async (req, res) => {
    try{
        let resp = await devisService.searchClient(req.query.search);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.searchProduit = async (req, res) => {
    try{
        let resp = await devisService.searchProduit(req.query.search);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.generateNumDevis = async (req, res) => {
    try{
        let numero = await devisService.generateNumDevis();
        res.send({numero});
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.getProduitByCode = async (req, res) => {
    try{
        let produit = await devisService.getProduitByCode(req.query.code);
        res.send({produit});
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


exports.getItemsDevisBySecuredKey = async (req, res) => {
    try{
        let resp = await devisService.getItemsDevisBySecuredKey(req.query.securedKey, req.query.magasin);
        res.send(resp);
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
};

exports.getItemsDevisByNumero = async (req, res) => {
    try{
        let resp = await devisService.getItemsDevisByNumero(req.params.numero);
        res.send(resp);
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
};
exports.encaisserDevis = async (req, res) => {
    try{
        await devisService.encaisserDevis(req.params.numero);
        res.send({message: "Encaissé"});
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
};

exports.searchNumeroDevis = async (req, res) => {
    try{
        const resp = await devisService.searchNumeroDevis(req.query.search);
        res.send(resp);
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
};


exports.searchDesignationDevis = async (req, res) => {
    try{
        if(!req.query.magasin)
            throw new Error("Veuillez selectionner le magasin")
        const resp = await devisService.searchDevis(req.query.search, "designation", req.query.magasin);
        res.send(resp);
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
};

exports.imprimerDevis = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(112, req, res))
            return;   
        await imprimerDevis(req.body, res, req.user);
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
};

exports.scanDevis = async (req, res) => {
    try{
        let resp = await devisService.scanDevis(req.params.numero);
        res.send({message: "Scanné"});
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
};