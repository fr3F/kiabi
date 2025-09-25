module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("./sale.controller");
    const router = require("express").Router();

    router.get("/magasins/:idMagasin/tickets", [authJwt.verifyToken], controller.getTicketsByMagasin);
    router.post("/magasins/:idMagasin/tickets/send", [authJwt.verifyToken], controller.sendTicketsMagasin);

    router.get("/tickets/:idTicket", [authJwt.verifyToken], controller.findTicketById);


    app.use("/api/sales", router);

};
