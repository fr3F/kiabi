module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("./shipment.controller");
    const router = require("express").Router();

    router.get("/", [authJwt.verifyToken], controller.getListShipments);
    router.get("/:id", [authJwt.verifyToken], controller.findShipmentById);

    router.patch("/receptions/items", controller.receiveItems);
    router.patch("/:id/receive", [authJwt.verifyToken], controller.receiveShipment);

    app.use("/api/shipments", router);

};
