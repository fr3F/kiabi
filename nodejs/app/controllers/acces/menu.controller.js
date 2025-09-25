 const menuServ = require('../../services/acces/menu.service');
const foncServ = require('../../services/acces/fonctionnalite.service');
const helper = require("./../../helpers/helpers.helper");

// Controleur pour les menus dans back office sodim 

// Recuperer les menus pour un utilisateur
const getMenu = async (req, res) => {
    try{    
        let id = req.userId;
        let rep = await menuServ.getMenuUser(id);
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

// Recuperer tous les menus 
const getAllMenu = async (req, res) => {
    try{    
        let rep = await menuServ.getAllMenu();
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}

// Recuperer les menus pour un role
const getAllMenuRole = async (req, res) => {
    try{    
        let idRole = req.params.roleId;
        let rep = await menuServ.getMenuRole(idRole);
        res.send(rep)
    }
    catch(err){
        helper.sendError(res, err);
    }
}


// const updateMenuRoles = async (req, res) => {
//     try{    
//         let idRole = req.params.roleId;
//         let menus = req.body.menus;
//         await menuServ.updateMenuRole(idRole, menus)
//         res.send({message: "OK"});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).send({message: err.message});
//     }
// }

// Modifier l'acces aux menu et fonctionnalite pour un role
const updateAcces = async (req, res) => {
    try{    
        if(!await foncServ.verifierAccesConnecte(8, req, res))
            return;     
        let idRole = req.params.roleId;
        let menus = req.body.menus;
        let modules = req.body.modules;
        await menuServ.updateMenuRole(idRole, menus);
        await foncServ.insererFonctionnalite(idRole, modules);
        res.send({message: "OK"});
    }
    catch(err){
        helper.sendError(res, err);
    }
}

// Tester si l'utilisateur a l'accès au menu
const testAccess = async (req, res) => {
    try{
        let acces = await menuServ.testAcces(req.user.idRole, req.params.id);
        res.send({acces});
    }
    catch(err){
        helper.sendError(res, err);
    }
}

module.exports = {
    getMenu,
    getAllMenu,
    getAllMenuRole,
    updateAcces,
    testAccess
}