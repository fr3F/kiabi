const foncServ = require('../../services/acces/fonctionnalite.service');

// Gerer erreur
function gererErreur(err, res){

    console.log(err)
    res.status(500).send({message: err.message});
}

// Recuperer les modules avec ses fonctionnalites
const getAllModuleAvecFonctionnalite = async (req, res) => {
    try{    
        let rep = await foncServ.getAllModuleAvecFonctionnalite()
        res.send(rep)
    }
    catch(err){
        gererErreur(err, res);
    }
}

// Recuperer les fonctionnalites dans un module pour un role
const getFonctionnaliteModuleRole = async (req, res) => {
    try{    
        let idRole = req.query.idRole;
        let idModule = req.query.idModule;
        let rep = await foncServ.getFonctionnaliteModuleRole(idModule, idRole)
        res.send(rep)
    }
    catch(err){
        gererErreur(err, res);
    }
}

// Recuperer les fonctionnalites d'un role
const getFonctionnaliteRole = async (req, res) => {
    try{    
        let idRole = req.params.idRole;
        let rep = await foncServ.getFonctionnaliteRole(idRole)
        res.send(rep)
    }
    catch(err){
        console.log(err)

        gererErreur(err, res);
    }
}

// const insererFonctionnalite = async (req, res) => {
//     try{    
//         let idRole = req.params.idRole;
//         let modules = req.body.modules;
//         let rep = await foncServ.insererFonctionnalite(idRole, modules)
//         res.send(rep)
//     }
//     catch(err){
//         gererErreur(err, res);
//     }
// }


// Tester si l'utilisateur a l'accès au menu
const testAccess = async (req, res) => {
    try{
        let acces = await foncServ.testAcces(req.user.idRole, req.params.id);
        res.send({acces});
    }
    catch(err){
        helper.sendError(res, err);
    }
}


module.exports = {
    getAllModuleAvecFonctionnalite,
    getFonctionnaliteModuleRole,
    getFonctionnaliteRole,
    testAccess
    // insererFonctionnalite
}