module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/gifi/client-vip.controller");
    const router = require("express").Router();

    router.post("/", [authJwt.verifyToken], controller.create);
    router.post("/import-excel", [authJwt.verifyToken], controller.importExcel);
    router.get("/", [authJwt.verifyToken], controller.list);
    router.get("/:id", [authJwt.verifyToken], controller.findById);
    router.put("/:id", [authJwt.verifyToken], controller.update);
    router.patch("/:id/activer-carte", [authJwt.verifyToken], controller.activerCarte);
    router.delete("/:id", [authJwt.verifyToken], controller.delete);
    router.get("/util/export-excel", [authJwt.verifyToken], controller.exportExcel);
    router.post("/send-kiabi", [authJwt.verifyToken], controller.sendToKiabi);

    
    app.use("/api/gifi/client-vips", router);

};
