module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/cloture/parametrage.controller");
    const router = require("express").Router();

    router.post("/", [authJwt.verifyToken], controller.create);
    router.get("/", [authJwt.verifyToken], controller.list);
    router.get("/:id", [authJwt.verifyToken], controller.findById);
    router.put("/:id", [authJwt.verifyToken], controller.update);
    router.delete("/:id", [authJwt.verifyToken], controller.delete);

    router.get("/magasins/non-parametre", [authJwt.verifyToken], controller.getMagasins);


    app.use("/api/parametrage-clotures/", router);

};
