// routes/inventaire-Surplus.routes.js
const express = require("express");
const router = express.Router();
const InventaireSurplusController = require("../controllers/inventaireSurplus.controller");

let routes = (app) => {
  app.use("/api/inventaire/Surplus", router);

  // Articles comptés mais pas dans le snapshot
  router.get("/:idinventaire/absent-snapshot", InventaireSurplusController.getAbsentSnapshot);

  // Articles comptés supérieurs au stock du snapshot
  router.get("/:idinventaire/overstock", InventaireSurplusController.getOverStock);

  // Articles introuvables (stock > comptage)
  router.get("/:idinventaire/introvable", InventaireSurplusController.getIntrouvable);

};

module.exports = routes;


