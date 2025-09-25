module.exports = function (app) {
    const { authJwt } = require("../../middleware");
    const controller = require("../../controllers/users/user.controller");
    const router = require("express").Router();

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get("/", [authJwt.verifyToken], controller.search);
    router.get("/show/:id", [authJwt.verifyToken], controller.findOne);
    router.put("/:id", [authJwt.verifyToken], controller.edit);
    router.put("/deactivate/:id", [authJwt.verifyToken], controller.deactivate);
    router.post("/", [authJwt.verifyToken], controller.create);
    // router.post("/", [authJwt.verifyToken], controller.create);
    router.put("/activate/:id", [authJwt.verifyToken], controller.activate);
    router.put("/resetPassword/:id", [authJwt.verifyToken], controller.reinitializePassword);
    router.put("/reset/password", controller.reinitializePasswordEmail);    
    router.put("/modifyPassword/:id", [authJwt.verifyToken], controller.modifyPassword);
    router.put("/modify/password", [authJwt.verifyToken], controller.modifyPassword);
    router.get("/get/roles", [authJwt.verifyToken], controller.getRoles);
    // console.log("***".repeat(5))
    // console.log(app)

    app.use("/api/users", router);

};
