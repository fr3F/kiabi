const { sendError } = require("../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const { createArticleOffertMontant, getArticleOffertsMontants } = require("../../services/util/produit/article-offert/montant.service");
const articleService = require("./../../services/util/produit/article-offert/produit.service");

// Article offert produit
exports.createArticleOffert = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(104, req, res))
            return;   
        let resp = await articleService.createArticleOffertProduit(req.body);
        res.send({message: "Created"});
    }
    catch(err){
        sendError(res, err);
    }
};


exports.deleteArticleOffert = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(104, req, res))
            return;   
        await articleService.deleteArticleOffert(req.params.id);
        res.send({message: "Deleted"});
    }
    catch(err){
        sendError(res, err);
    }
};

exports.getProductWithArticleOfferts = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(105, req, res))
            return;   
        const resp = await articleService.getProductWithArticleOfferts(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};



exports.getArticleOffertsProduitMagasin = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(105, req, res))
            return;   
        const resp = await articleService.getArticleOffertsProduitMagasin(req.params.code, req.query.magasin);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.verifierDupliquer = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(104, req, res))
            return;   
        const duplique = await articleService.verifyDuplique(req.body);
        res.send({duplique});
    }
    catch(err){
        sendError(res, err);
    }

}

// Article offert montant
exports.createArticleOffertMontant = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(104, req, res))
            return;   
        await createArticleOffertMontant(req.body);
        res.send({message: "Created"});
    }
    catch(err){
        sendError(res, err);
    }
};


exports.getArticleOffertsMontants = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(105, req, res))
            return;   
        const resp = await getArticleOffertsMontants(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};
