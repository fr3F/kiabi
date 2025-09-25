const { authJwt } = require("../../../../middleware");

module.exports = function (app) {
    const controller = require("./carte-vip.controller");
    const router = require("express").Router();

    router.post("/parametrage", [authJwt.verifyToken], controller.updateParametrage);
    router.get("/parametrage", [authJwt.verifyToken], controller.findParametrage);
    router.get("/parametrage/historiques", [authJwt.verifyToken], controller.getHistoriquesParametrage);

    router.get("/", [authJwt.verifyToken], controller.list);

    router.get("/point", controller.getPoint);
    router.patch("/point/ajouter", controller.addPoint);
    router.patch("/point/utiliser", controller.usePoint);
    router.patch("/point/update", controller.updatePoint);
    router.patch("/point/initialiser", controller.resetPoint);
    
    router.get("/historiques-conso", [authJwt.verifyToken], controller.getHistoriquesConso);
    router.get("/regularisations/tickets", [authJwt.verifyToken], controller.getTicketsToRegularize);

    app.use("/api/carte-vip", router);

};
