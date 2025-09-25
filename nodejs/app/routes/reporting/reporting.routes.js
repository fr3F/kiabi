module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/reporting/reporting.controller");
    const router = require("express").Router();


    router.get("/controle-tickets", [authJwt.verifyToken], controller.getControleTicketMagasin);
    router.get("/controle-tickets/:idMagasin/caisses", [authJwt.verifyToken], controller.getControleTicketCaisse);

    app.use("/api/reportings/", router);

};
