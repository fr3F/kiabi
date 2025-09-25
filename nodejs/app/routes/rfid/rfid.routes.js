// fichier rfidRouter.js
module.exports = function(app) {
  const controller = require("../../controllers/rfid/rfidController");
  const router = require("express").Router();

  router.post("/sell", controller.markProductAsSold);
  router.get("/missing-sizes", controller.getMissingSizes);
  router.post("/tag", controller.postTag);
  router.get("/", (req, res) => {
    res.json({ message: "Welcome to SODIM application." });
  });

  app.use("/api/rfid", router);
};
