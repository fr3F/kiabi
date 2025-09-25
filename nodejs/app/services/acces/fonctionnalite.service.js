const { QueryTypes } = require("sequelize/dist");
const { sendError, sendErrorMessage } = require("../../helpers/helpers.helper");
const db  = require("../../models");

const queryInterface = db.sequelize.getQueryInterface();
const FonctionnaliteRole = db.fonctionnaliteRole;
const Fonctionnalite = db.fonctionnalite;
const Module = db.module;


// Recuperer les fonctionnalites d'un role
function getFonctionnaliteRole(idRole){
    return FonctionnaliteRole.findAll({
        where:{
            roleId: idRole
        },
    });

}

// Recuperer les modules avec ses fonctionnalites
function getAllModuleAvecFonctionnalite(){
    return Module.findAll(
        {
            include: ["fonctionnalites"],
            order: [
                ["id", "ASC"],
                [{model: Fonctionnalite, as: "fonctionnalites"}, "id", "ASC"]
            ]
        }
    );
}

// Recuperer les fonctionnalites d'un role dans un module
function getFonctionnaliteModuleRole(idModule, idRole){
    return Fonctionnalite.findAll({
        include:[
            {
                model: Module,
                as: "module",
                where: {
                    id: idModule
                }
            },
            {
                model: db.role,
                as: "roles",
                where: {
                    id: idRole
                }
            }
        ]
    });
}

// Recuperer les fonctionnalites d'un role a partir des tableaux de modules avec attribut checked dans ses fonctionnalités
function genererFonctionnalite(idRole, modules){
    let rep = [];
    for(let i = 0; i < modules.length; i ++){
        for(let j = 0; j < modules[i].fonctionnalites.length; j ++){
            if(modules[i].fonctionnalites[j].checked)
                rep.push({roleId: idRole, fonctionnaliteId: modules[i].fonctionnalites[j].id})
        } 
    }
    return rep;
}

// Inserer les fonctionnalités pour un role avec tableau de modules(attribut checked)
async function insererFonctionnalite(idRole, modules){
    await FonctionnaliteRole.destroy({where: {
        roleId: idRole
    }});
    let tab = genererFonctionnalite(idRole, modules)
    if(tab.length == 0) return;
    await queryInterface.bulkInsert("fonctionnalite_roles", tab);
}

// Tester si l'user a l'accès a la fonctionnalité
async function testAcces(roleId, fonctionnaliteId){
    let menu = await FonctionnaliteRole.findOne({where: {roleId, fonctionnaliteId}});
    if(!menu)
        return false;
    return true;
}

// Verifier accès user connecté a la fonctionnalité
async function verifierAccesConnecte(idFonctionnalite, req, res){
    if(!req.user)
        return;
    let test = await testAcces(req.user.idRole, idFonctionnalite);
    if(!test){
        const stack = `IdUser: ${req.user.id}, fonctionnalité: ${idFonctionnalite}, idRole: ${req.user.idRole}`  
        sendErrorMessage(res, "Accès refusé", 403);
    }
    return test;
}

module.exports = {
    insererFonctionnalite,
    getFonctionnaliteModuleRole,
    getAllModuleAvecFonctionnalite,
    getFonctionnaliteRole,
    testAcces,
    verifierAccesConnecte
}
