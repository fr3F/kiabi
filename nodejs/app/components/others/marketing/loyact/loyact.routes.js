const { authJwt } = require("../../../../middleware");

module.exports = function (app) {
    const controller = require("./loyact.controller");
    const router = require("express").Router();

    router.post("/card-creation", controller.addCardCreation);
    router.post("/ticket-recovery", controller.addTicketRecovery);
    router.post("/anniversary", controller.addAnniversary);
    router.post("/birth-points", controller.addBirthPoints);
    router.post("/welcome-pack", controller.addWelcomePack);
    router.post("/marketing-operation", controller.addMarketingOperation);
    router.post("/card-transfert", controller.addCardTransfert);
    router.post("/card-blocking", controller.addCardBlocking);

    router.get("/utils/causes/transferts", controller.getTransertCauses);
    router.get("/utils/causes/blockings", controller.getBlockingCauses);

    app.use("/api/loyacts", router);

};
