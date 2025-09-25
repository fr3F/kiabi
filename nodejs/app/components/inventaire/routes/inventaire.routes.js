const express = require("express");
const router = express.Router();
const inventaireController = require("../controllers/inventaire.controller");

let routes = (app) => {
  app.use("/api/inventaire", router);

  // CRUD Inventaire
  router.get("/", inventaireController.list);

  router.post("/", inventaireController.createInventaire);
  router.get("/:id", inventaireController.detail);

  // Comptage
  router.post("/:id/comptages", inventaireController.addComptages);

  // Détail snapshot + comptage
//   router.get("/:id/detail-with-count", inventaireController.detailWithCountInventaire);

  // Détail paginé
  router.get("/:idinventaire/detail", inventaireController.getDetailInventaire);

  // Export Excel
  router.get("/:idinventaire/export-excel", inventaireController.exportExcel);

  router.delete("/:idinventaire", inventaireController.delete);
  
  router.put("/:id", inventaireController.update);

  router.put("/:id", inventaireController.update);

  router.get("/:idinventaire/progress", inventaireController.getProgress);
  
  router.get("/surplus-negatif/:id", inventaireController.getSurplusNegatif);
  router.get("/introuvables/:idinventaire", inventaireController.getIntrouvablesController);
  router.get("/:id/summary", inventaireController.getInventaireSummary);

};

module.exports = routes;

