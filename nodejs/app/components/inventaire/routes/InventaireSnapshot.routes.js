const express = require("express");
const inventaireSnapshotController = require("../controllers/InventaireSnapshot.controller");
const router = express.Router();

let routes = (app) => {
  // Headers pour autoriser certaines requêtes
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Préfixe pour les routes inventaire snapshot
  app.use("/api/inventaire-snapshot", router);

  // CRUD Snapshot
  // router.get("/", (req, res) => res.status(400).json({ message: "Utiliser /inventaire-snapshot/:idinventaire" })); // pas utilisé
  router.get("/:id", inventaireSnapshotController.detail); // Détail par id
  router.put("/:id", inventaireSnapshotController.update); // Mettre à jour un snapshot

  // Lister tous les snapshots d'un inventaire
  router.get("/inventaire/:idinventaire",inventaireSnapshotController.listByInventaire);
};

module.exports = routes;
