const { Encaissement } = require("../../models");

module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/caisse/caisse.controller");
    const router = require("express").Router();

    // router.post("/", [authJwt.verifyToken], controller.createCaisse);

    // Contrôle de caisse
    router.post("/", [authJwt.verifyToken], controller.createCaisse);
    router.put("/:id", [authJwt.verifyToken], controller.updateCaisse);

    router.post("/test-connexion", [authJwt.verifyToken], controller.testConnexion);
    router.patch("/:id/test-connected", [authJwt.verifyToken], controller.testConnected);

    // router.put("/:id/install", [authJwt.verifyToken], controller.installCaisse);
    // router.put("/:id/synchronize", [authJwt.verifyToken], controller.synchronizeCaisse);
    // router.put("/:id/re-install", [authJwt.verifyToken], controller.reinstallCaisse);
  
    // router.put("/:id/re-install-table/:idTableSynchro", [authJwt.verifyToken], controller.reinstallTable);

    //charger encaissement
    router.post("/:id/charger-encaissement", [authJwt.verifyToken], controller.chargerEncaissementCaisse);
    router.post("/charger-encaissement/:id", controller.chargerEncaissementCaisse2);
    router.post("/charger-encaissement-json", controller.chargerEncaissementJSON);

    // router.get("/getEncaissements", controller.getAllEncaissements);     
      
    // Encaissement
    router.post("/encaissements", [authJwt.verifyToken], controller.createUtilisateur);

    // router.get("/:id/export-json", [authJwt.verifyToken], controller.exportJsonCaisse);
    router.get("/:id/encaissements", [authJwt.verifyToken], controller.getEncaissementsCaisse);
    
    // router.put("/synchronize/numero", controller.synchronizeCaisseNumero);

    // // Article caisse (ventes des articles dans les tickets)
    router.get("/:id/article-tickets", [authJwt.verifyToken], controller.getArticleTicketsCaisse);
    router.get("/:id/article-tickets-code/:code", [authJwt.verifyToken], controller.getArticleTicketsCaisseByCode);
    router.get("/:id/article-tickets/export", [authJwt.verifyToken], controller.exporterExcelVentesCaisses);

    // Tickets
    router.get("/:id/tickets", [authJwt.verifyToken], controller.getTicketsCaisse);
    router.get("/:id/tickets/:idTicket", [authJwt.verifyToken], controller.findTicketCaisseById);
    router.post("/:id/tickets/:idTicket/charger-magasin", [authJwt.verifyToken], controller.chargerTicketMagasinById);
    router.post("/tickets/charger-magasin", controller.chargerTicketMagasinByNoCaisse);

    app.use("/api/caisses", router);

};

