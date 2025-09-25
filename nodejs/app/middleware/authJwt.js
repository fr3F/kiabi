const jwt = require("jsonwebtoken");
const config = require("../config/environments/mysql/auth.config");
const db = require("../models");
const User = db.user;

// Verifier si un utilisateur est connecté(avec status non connecté)
verifyToken = async (req, res, next) => {
    // let token = req.headers["x-access-token"];
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(401).send({
            message: "Aucun token fourni !",
        });
    }

    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    await jwt.verify(bearerToken, config.secret,async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Non autorisé!",
            });
        }

        req.userId = decoded.id;
        await User.findByPk(req.userId).then((user) => {
            req.user = user;
        })
        // console.log("**********************************************--------------------")
        // console.log(req.userId)
        next();
    });
};

// ajouter à req un attribut user et userId si un utilisateur est connecté
setUserConnecte = async (req, res, next) => {
    // let token = req.headers["x-access-token"];
    let token = req.headers["authorization"];

    if (!token) {
        next();
        return;
    }
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    await jwt.verify(bearerToken, config.secret,async (err, decoded) => {
        if (err) {
            next();
            return;
        }
        req.userId = decoded.id;
        await User.findByPk(req.userId).then((user) => {
            req.user = user;
        })
        next();
    });
};



// isAdministrateur = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRole().then((role) => {
//             if (role.name === "administrateur") {
//                 next();
//                 return;
//             }

//             res.status(403).send({
//                 message: "Vous n'êtes pas administrateur!",
//             });
//             return;
//         });
//     });
// };

// isResponsable = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRole().then((role) => {
//             if (role.name === "responsable") {
//                 next();
//                 return;
//             }

//             res.status(403).send({
//                 message: "Require Role Responsable!",
//             });
//             return;
//         });
//     });
// };

// isCommercial = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRole().then((role) => {
//             if (role.name === "commercial") {
//                 next();
//                 return;
//             }

//             res.status(403).send({
//                 message: "Require Role Commercial!",
//             });
//             return;
//         });
//     });
// };

// isClient = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRole().then((role) => {
//             if (role.name === "client") {
//                 next();
//                 return;
//             }

//             res.status(403).send({
//                 message: "Require Role Client!",
//             });
//             return;
//         });
//     });
// };

const authJwt = {
    verifyToken: verifyToken,
    // isAdministrateur: isAdministrateur,
    // isResponsable: isResponsable,
    // isCommercial: isCommercial,
    // isClient: isClient,
    setUserConnecte
};
module.exports = authJwt;
