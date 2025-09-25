module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("./catalog.controller");
    const router = require("express").Router();

    router.get("/", [authJwt.verifyToken], controller.getListCatalogs);
    router.get("/cls/groups", [authJwt.verifyToken], controller.getAllGroups);
    router.get("/cls/markets", [authJwt.verifyToken], controller.getAllMarkets);
    router.get("/cls/departments", [authJwt.verifyToken], controller.getAllDepartments);
    router.get("/cls/classes", [authJwt.verifyToken], controller.getAllClasses);
    router.get("/cls/hierrarchies", [authJwt.verifyToken], controller.getCLSHierrarchies);
    router.get("/lectures", [authJwt.verifyToken], controller.getListCatalogsByCodeEAN);
    router.get("/hello", (req, res) => { res.json({ message: "Welcome to SODIM application kiabi." })})
    
    app.use("/api/catalogs", router);
};
