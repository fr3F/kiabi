module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/caisse/log.controller");
    const router = require("express").Router();


    router.get("/grouped", [authJwt.verifyToken], controller.getLogCaisseGrouped);
    router.get("/", [authJwt.verifyToken], controller.getLogCaisse);

    router.get("/articles/suppression-ligne", [authJwt.verifyToken], controller.getArticlesSuppressionLigne);
    router.get("/articles/suppression-ligne/excel", [authJwt.verifyToken], controller.exportArticlesSuppressionLigne);
    router.get("/articles/annulation-ticket", [authJwt.verifyToken], controller.getArticlesAnnulationTicket);
    router.get("/articles/annulation-ticket/excel", [authJwt.verifyToken], controller.exportArticlesAnnulationTicket);

    app.use("/api/log-caisses", router);

};
