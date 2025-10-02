const express = require("express");
const inventaireController = require("./inventaire.controller");
const router = express.Router();

let routes = (app) => {
  app.use("/api/inventaire", router);

  // CRUD Inventaire
  router.get("/", inventaireController.listInventaire);
  router.delete("/:idinventaire", inventaireController.deleteInventaire);
  router.put("/:id", inventaireController.updateInventaire);
  router.post("/", inventaireController.createInventaire);

  // Detail inventaire by id
  router.get("/:id", inventaireController.getInventaireById);

  // Ajout Comptage (API)
  router.post("/:id/comptages", inventaireController.addComptages);

  // Détail 
  router.get("/:idinventaire/detail", inventaireController.getDetailInventaire);

  // Export Excel
  router.get("/:idinventaire/export-excel", inventaireController.exportExcel);

  // Listes surplus
  router.get("/surplus/:id", inventaireController.getSurplusListes);

  // Listes introuvables
  router.get("/introuvables/:idinventaire", inventaireController.getIntrouvablesListes);
 
  // Resumer d'inventaire
  router.get("/:id/summary", inventaireController.getInventaireSummary);
};

module.exports = routes;

