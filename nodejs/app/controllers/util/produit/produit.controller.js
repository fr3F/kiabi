const { sendError } = require("../../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../../services/acces/fonctionnalite.service");
// const { getEmplacement } = require("../../../services/appro/virement/item.service");
// const { getInfoGifiArticle } = require("../../../services/gifi/article/article.service");
const produitService = require("../../../services/util/produit/produit.service");
// const { getHistoriquesPrixProduit } = require("../../../services/util/produit/update-prix/historique.service");
// const { getRefFournisseur, findProductWithGammes, findProduitByBarcodeWithoutMagasin } = require("../../../services/util/produit/util.service");
const { ACCES_PRODUIT } = require("./util");


exports.findProductByCode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.view, req, res))
            return;   
        let resp = await produitService.findProduct(req.query.code);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

async function getDataProducts(req, res, fonction, verifyAccess = true){
    try{
        if(verifyAccess && !await verifierAccesConnecte(ACCES_PRODUIT.view, req, res))
            return;   
        let resp = await fonction(req.params.code);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

exports.getArticleTickets = async (req, res) => {
    await getDataProducts(req, res, produitService.getArticleTickets);
}

exports.getArticleOfferts = async (req, res) => {
    await getDataProducts(req, res, produitService.getArticleOfferts);
}

exports.getBarcodes = async (req, res) => {
    await getDataProducts(req, res, produitService.getBarcodes);
}

exports.getBaremesPourcentages = async (req, res) => {
    await getDataProducts(req, res, produitService.getBaremesPourcentages);
}

exports.getGammes = async (req, res) => {
    await getDataProducts(req, res, produitService.getGammes, false);
}

// exports.getItemPromotions = async (req, res) => {
//     await getDataProducts(req, res, produitService.getItemPromotions);
// }

exports.getRemiseMagasins = async (req, res) => {
    await getDataProducts(req, res, produitService.getRemiseMagasins);
}

exports.getStocks = async (req, res) => {
    await getDataProducts(req, res, produitService.getStocks);
}

exports.getStocksLS = async (req, res) => {
    await getDataProducts(req, res, produitService.getStocksLS);
}

exports.getStockMagasins = async (req, res) => {
    await getDataProducts(req, res, produitService.getStockMagasins);
}


exports.getTarifMagasins = async (req, res) => {
    await getDataProducts(req, res, produitService.getTarifMagasins);
}

// exports.getInfoGifi = async (req, res) => {
//     await getDataProducts(req, res, getInfoGifiArticle, false);
// }

// exports.getHistoriquePrix = async (req, res) => {
//     await getDataProducts(req, res, getHistoriquesPrixProduit, false);
// }

// exports.getRefFournisseur = async (req, res) => {
//     await getDataProducts(req, res, getRefFournisseur, false);
// }

// exports.getEmplacementArticle = async (req, res) => {
//     try{
//         const { gamme, depot } = req.query;
//         const code = req.params.code;
//         let emplacement = await getEmplacement(code, gamme, depot);
//         res.send({emplacement});
//     }
//     catch(err){
//         sendError(res, err);
//     }
// };


exports.searchProduits = async (req, res) => {
    try{
        let resp = await produitService.searchProduits(req.query.search);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

// Produit qui ont un code qui commence par une lettre
exports.searchProduitsLettre = async (req, res) => {
    try{
        let resp = await produitService.searchProduits(req.query.search, true);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


// Produit par catégorie
exports.searchProduitsCategorie = async (req, res) => {
    try{
        let resp = await produitService.searchProduitsCategorie(req.query.search, req.params.categorie);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

exports.getProduitByBarcode = async (req, res) => {
    try{
        let produit = await produitService.getProduitByBarcode(req.query.barcode, req.query.idMagasin);
        res.send(produit);
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
};

exports.getNomenclatures = async (req, res) => {
    try{
        let gamme = req.query.gamme ? decodeURIComponent(req.query.gamme) : "";
        let resp = await produitService.getNomenclaturesProduit(req.params.code, gamme);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

// exports.findProductByCodeWithGammes = async (req, res) => {
//     try{
//         let resp = await findProductWithGammes(req.query.code);
//         res.send(resp);
//     }
//     catch(err){
//         res.status(500).send({message: err.message})
//     }
// };


// exports.findProductByBarcodeWithGammes = async (req, res) => {
//     try{
//         let resp = await findProduitByBarcodeWithoutMagasin(req.query.barcode);
//         res.send(resp);
//     }
//     catch(err){
//         res.status(500).send({message: err.message})
//     }
// };