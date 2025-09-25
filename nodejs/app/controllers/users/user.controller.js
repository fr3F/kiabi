const db = require("../../models");
const User = db.user;
// console.log(User)
const Op = db.Sequelize.Op;
const userServ = require("../../services/user/user.service");
const helper = require("../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
// const { user } = require("../../models");

// Voir un Utilisateur
exports.findOne = (req, res) => {
    userServ.findOne(req, res);
};

// Rechercher des Utilisateurs
exports.search = async (req, res) => {
   await userServ.rechercher(req, res)
};

// Modifier un Utilisateur
exports.edit = async (req, res) => {
    await userServ.modifier(req, res);
};

// Desactiver un compte utilisateur
exports.deactivate = async (req, res) => {
    const id = req.params.id;
    await userServ.changeStatus(false, id, req, res)    
};

// Activer un compte utilisateur
exports.activate = async (req, res) => {
    const id = req.params.id;
    await userServ.changeStatus(true, id, req, res);    
};

// Creer un utilisateur 
exports.create = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(1, req, res))
            return;   
        await userServ.createUser(req, res);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


// Creer un utilisateur
exports.modifyPassword = async (req, res) => {
    try{
        await userServ.modifyPassword(req, res);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

// Réinitialiser mot de passe
exports.reinitializePassword = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(7, req, res))
            return;   
        let id = req.params.id;
        await userServ.resetPassword(id, res);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};


// Réinitialiser mot de passe
exports.reinitializePasswordEmail = async (req, res) => {
    try{
        let email = req.body.email;
       await userServ.resetPasswordEmail(email, res);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};



// Réinitialiser mot de passe client
exports.reinitializePasswordClient = async (req, res) => {
    try{
        let code = req.body.code;
        let client = db.customers.findOne({where:{codeclient:  code}});
        if(!client) throw new Error("Ce code n'existe pas");
        await userServ.resetPasswordEmail(client.email, res);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

exports.getRoles = (req, res) => {
    db.role.findAll()
        .then((response) => {
                res.send(response)
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erreur lors de la récupération des roles"
            });
        });
};

exports.logDeconnexion = async (req, res) => {
    try{
        await userServ.logDeconnexion(req.userId);
        res.send({message: "Déconnexion"})
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};