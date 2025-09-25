module.exports = function (app) {
    const { authJwt } = require("../../../middleware");
    const controller = require("./magasin.controller");
    const router = require("express").Router();

    router.get("/utils/all", [authJwt.verifyToken], controller.getAllMagasins);

    router.post("/", [authJwt.verifyToken], controller.create);
    router.get("/", [authJwt.verifyToken], controller.list);
    router.get("/:id", [authJwt.verifyToken], controller.findById);
    router.put("/:id", [authJwt.verifyToken], controller.update);
    router.patch("/parametre-reglements/:id", [authJwt.verifyToken], controller.updateModePaiement);
    
    router.get("/get/all", [authJwt.verifyToken], controller.findAllMagasin);
    router.get("/get/gifi", controller.findAllMagasinGifi);
    router.get("/get/monnaies", [authJwt.verifyToken], controller.getMonnaies);

    router.get("/get/all-attached", [authJwt.verifyToken], controller.findAllMagasinUser);
    router.get("/:id/caisses", [authJwt.verifyToken], controller.getCaisses);
    
    router.get("/find-by-identifiant/:identifiant", controller.findMagasinByIdentifiant);

    router.patch("/email-depots/:id", [authJwt.verifyToken], controller.updateEmailDepot);
    router.get("/get/depots", [authJwt.verifyToken], controller.getAllDepots);

    router.get("/:identifiant/mode-paiements", [authJwt.verifyToken], controller.getModePaiements);    
    
    app.use("/api/magasins", router);

};
