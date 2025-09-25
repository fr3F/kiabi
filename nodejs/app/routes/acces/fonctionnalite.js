// const express = require("express");
// const router = express.Router();
// const controller = require("../../controllers/acces/fonctionnalite.controller");
// const authJwt = require("../../middleware/authJwt");

// let routes = (app) => {
    
//     app.use(function (req, res, next) {
//         res.header(
//             "Access-Control-Allow-Headers",
//             "Authorization, Origin, Content-Type, Accept"
//         );
//         next();
//     });
//     app.use("/fonctionnalites", [authJwt.verifyToken], router);

//     router.get("/", controller.getAllModuleAvecFonctionnalite)
//     router.get("/moduleRole", controller.getFonctionnaliteModuleRole)
//     router.get("/role/:idRole", controller.getFonctionnaliteRole)
//     router.put("/:idRole", controller.insererFonctionnalite)
    
// };

// module.exports = routes;
