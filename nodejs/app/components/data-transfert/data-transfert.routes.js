module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("./data-transfert.controller");
    const router = require("express").Router();

    router.post("/", [authJwt.verifyToken], controller.updateAllDataFromFtp);
    router.get("/historiques", [authJwt.verifyToken], controller.getListHistories);
    
    app.use("/api/data-transferts", router);

};
