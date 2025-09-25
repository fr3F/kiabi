const { verifyCodeProduit } = require("../../middleware/produit");

module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/util/produit/produit.controller");
    const prixController = require("../../controllers/util/produit/prix.controller");
    const barcodeController = require("../../controllers/util/produit/barcode.controller");
    const articleOffertController = require("../../controllers/util/articleoffert.controller");
    const router = require("express").Router();

    router.get("/find/by-code", [authJwt.verifyToken], controller.findProductByCode);
  
    router.get("/:code/article-tickets", [authJwt.verifyToken, verifyCodeProduit], controller.getArticleTickets);
    router.get("/:code/barcodes", [authJwt.verifyToken, verifyCodeProduit], controller.getBarcodes);
    router.get("/:code/baremes-pourcentages", [authJwt.verifyToken, verifyCodeProduit], controller.getBaremesPourcentages);
    router.get("/:code/gammes", [verifyCodeProduit], controller.getGammes);
    // router.get("/:code/item-promotions", [authJwt.verifyToken, verifyCodeProduit], controller.getItemPromotions);
    router.get("/:code/remise-magasins", [authJwt.verifyToken, verifyCodeProduit], controller.getRemiseMagasins);
    router.get("/:code/stocks", [authJwt.verifyToken, verifyCodeProduit], controller.getStocks);
    router.get("/:code/stocks-ls", [authJwt.verifyToken, verifyCodeProduit], controller.getStocksLS);
    router.get("/:code/stock-magasins", [authJwt.verifyToken, verifyCodeProduit], controller.getStockMagasins);
    router.get("/:code/tarif-magasins", [authJwt.verifyToken, verifyCodeProduit], controller.getTarifMagasins);
    router.get("/:code/article-offerts", [authJwt.verifyToken, verifyCodeProduit], controller.getArticleOfferts);

    // router.get("/:code/historiques-prix", [authJwt.verifyToken, verifyCodeProduit], controller.getHistoriquePrix);
    // router.get("/:code/ref-fournisseur", [authJwt.verifyToken, verifyCodeProduit], controller.getRefFournisseur);
    // router.get("/:code/emplacement", [authJwt.verifyToken, verifyCodeProduit], controller.getEmplacementArticle);
    
    router.get("/:code/nomenclatures", controller.getNomenclatures);
    // router.get("/:code/info-gifi", controller.getInfoGifi);

    // Code barres
    router.post("/:code/barcodes", [authJwt.verifyToken, verifyCodeProduit], barcodeController.createBarcode);
    router.put("/barcodes/:id", [authJwt.verifyToken], barcodeController.updateBarcode);
    router.delete("/barcodes/:id", [authJwt.verifyToken], barcodeController.deleteBarcode);
    router.delete("/barcodes/:id/gifi", [authJwt.verifyToken], barcodeController.deleteBarcodeGifi);
    router.get("/barcodes/generate", [authJwt.verifyToken], barcodeController.generateBarcode);
    router.post("/barcodes/import", [authJwt.verifyToken], barcodeController.importBarcode);
    router.post("/barcodes/print", [authJwt.verifyToken], barcodeController.printBarcodes);
    router.get("/barcodes/:barcode", [authJwt.verifyToken], barcodeController.findBarcode);

    router.get("/barcodes/:id/print", [authJwt.verifyToken], barcodeController.printOneBarcode);
    router.get("/barcodes/:id/print-gifi", [authJwt.verifyToken], barcodeController.printOneBarcodeGifi);


    router.get("/", controller.searchProduits);
    router.get("/lettres", controller.searchProduitsLettre);
    router.get("/categories/:categorie", controller.searchProduitsCategorie);
    
    router.get("/find/by-barcode", [authJwt.verifyToken], controller.getProduitByBarcode);

    
    // router.get("/find/by-code/avec-gammes", controller.findProductByCodeWithGammes);
    // router.get("/find/by-barcode/avec-gammes", controller.findProductByBarcodeWithGammes);


    /* Section article offerts*/
    router.post("/article-offerts", [authJwt.verifyToken], articleOffertController.createArticleOffert);
    router.get("/:code/article-offerts-magasins", [authJwt.verifyToken], articleOffertController.getArticleOffertsProduitMagasin); // 
    router.delete("/article-offerts/:id", [authJwt.verifyToken], articleOffertController.deleteArticleOffert);
    router.post("/article-offerts/verifier-duplique", [authJwt.verifyToken], articleOffertController.verifierDupliquer);

    router.get("/avec-article-offerts", [authJwt.verifyToken], articleOffertController.getProductWithArticleOfferts);

    router.post("/article-offerts/montant", [authJwt.verifyToken], articleOffertController.createArticleOffertMontant);
    router.get("/article-offerts/montant", [authJwt.verifyToken], articleOffertController.getArticleOffertsMontants);

    // Prix produits
    router.patch("/prix/import", [authJwt.verifyToken], prixController.updatePrixFromFile);
    router.patch("/prix/import-tarif", [authJwt.verifyToken], prixController.updateTarifMagasinFromFile);
    router.get("/prix/historiques", [authJwt.verifyToken], prixController.getListHistoriquePrix);
    router.get("/prix/historiques/:id", [authJwt.verifyToken], prixController.findHistoriquePrixById);
    router.get("/prix/historiques/:id/export", [authJwt.verifyToken], prixController.exportHistoriqueSage);
    
    
    app.use("/api/produits", router);

};
