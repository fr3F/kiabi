module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/cloture/validation.controller");
    const transfertController = require("../../controllers/cloture/transfertSage.controller");
    const router = require("express").Router();

    router.get("/a-valider/magasins/:id", [authJwt.verifyToken], controller.getEncaissementAvalider);
    router.get("/a-valider", [authJwt.verifyToken], controller.getEncaissementAvalider);
    router.get("/:id/a-valider", [authJwt.verifyToken], controller.getDetailEncaissementAValider);

    router.get("/:id/imprimer-reglements", [authJwt.verifyToken], controller.imprimerReglements);

    router.patch("/:id/valider", [authJwt.verifyToken], controller.valider);
    
    router.delete("/:id", [authJwt.verifyToken], controller.deleteEncaissement);

    router.get("/a-regulariser", [authJwt.verifyToken], transfertController.getEncaissementARegulariser);
    router.get("/resume-jour", [authJwt.verifyToken], transfertController.getResumeJour);
    router.get("/sommaire-reglements", [authJwt.verifyToken], transfertController.getSommaireReglement);
    router.get("/sommaire-reglements/magasins/:idMagasin", [authJwt.verifyToken], transfertController.getSommaireReglementMagasin);
    router.get("/export-sage", [authJwt.verifyToken], transfertController.exporterSage);
    // router.get("/export-sage", transfertController.exporterSage);
    router.get("/export-sql", [authJwt.verifyToken], transfertController.exporterSql);
    router.get("/export-reglement", [authJwt.verifyToken], transfertController.exporterReglement);
    router.get("/export-ticket-excel", [authJwt.verifyToken], transfertController.exporterExcelTicket);
    router.get("/send-mail-sage", [authJwt.verifyToken], transfertController.sendMail);
    router.get("/detail-ticket-magasin", [authJwt.verifyToken], transfertController.getDetailTicketJourMagasin);


    app.use("/api/encaissements/", router);

};
