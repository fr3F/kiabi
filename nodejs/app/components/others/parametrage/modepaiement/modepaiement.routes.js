module.exports = function (app) {
    const { authJwt } = require("../../../../middleware");
    const controller = require("./modepaiement.controller");
    const router = require("express").Router();

    router.post("/", [authJwt.verifyToken], controller.create);
    router.get("/", [authJwt.verifyToken], controller.list);
    router.get("/:id", [authJwt.verifyToken], controller.findById);
    router.put("/:id", [authJwt.verifyToken], controller.update);
    router.delete("/:id", [authJwt.verifyToken], controller.delete);

    app.use("/api/parametrage/mode-paiements", router);

};
