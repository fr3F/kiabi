module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/parametrage/devis.controller");
    const router = require("express").Router();

    router.post("/", [authJwt.verifyToken], controller.create);
    router.get("/", [authJwt.verifyToken], controller.list);
    router.get("/:id", [authJwt.verifyToken], controller.findById);
    router.put("/:id", [authJwt.verifyToken], controller.update);
    router.delete("/:id", [authJwt.verifyToken], controller.delete);
    router.get("/util/search-clients", [authJwt.verifyToken], controller.searchClient);
    router.get("/util/search-produits", [authJwt.verifyToken], controller.searchProduit);
    router.get("/util/search-numeros", [authJwt.verifyToken], controller.searchNumeroDevis);
    router.get("/util/search-designations", [authJwt.verifyToken], controller.searchDesignationDevis);
    router.get("/util/generate-numero", [authJwt.verifyToken], controller.generateNumDevis);
    router.get("/util/get-produit-by-code", [authJwt.verifyToken], controller.getProduitByCode);
router.get("/", (req, res) => {
    res.send("Hello World !");
});


    router.post("/imprimer", [authJwt.verifyToken], controller.imprimerDevis);
    router.post("/:id/dupliquer", [authJwt.verifyToken], controller.duplicateDevis);

    router.get("/items/by-secured-key", controller.getItemsDevisBySecuredKey);
    router.get("/:numero/items", controller.getItemsDevisByNumero);
    router.patch("/:numero/scan", controller.scanDevis);
    router.put("/:numero/encaisser", controller.encaisserDevis);

    app.use("/api/devis", router);

};
