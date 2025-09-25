module.exports = function (app) {
    const { authJwt } = require("../../../middleware");
    const controller = require("./caisse.controller");
    const router = require("express").Router();

    // router.post("/", [authJwt.verifyToken], controller.createCaisse);
    router.post("/", [authJwt.verifyToken], controller.createCaisse);
    router.put("/:id", [authJwt.verifyToken], controller.updateCaisse);

    app.use("/api/caisses", router);

};
