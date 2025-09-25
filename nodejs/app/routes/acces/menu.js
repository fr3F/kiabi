const express = require("express");
const router = express.Router();
const menuController = require("../../controllers/acces/menu.controller");
const authJwt = require("../../middleware/authJwt");
const fController = require("../../controllers/acces/fonctionnalite.controller");

let routes = (app) => {
    
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use("/api/acces", [authJwt.verifyToken], router);

    router.get("/menus", menuController.getMenu)
    router.get("/menus/:id/acces", [authJwt.verifyToken], menuController.testAccess)
    router.get("/menus/all", menuController.getAllMenu)
    router.get("/menus/roles/:roleId", menuController.getAllMenuRole)
    router.put("/:roleId", menuController.updateAcces)

    router.get("/fonctionnalites", fController.getAllModuleAvecFonctionnalite)
    router.get("/fonctionnalites/:id/acces", [authJwt.verifyToken], fController.testAccess)
    router.get("/fonctionnalites/moduleRole", fController.getFonctionnaliteModuleRole)
    router.get("/fonctionnalites/roles/:idRole", fController.getFonctionnaliteRole)
    // router.put("/:idRole", controller.insererFonctionnalite)
};

module.exports = routes;
