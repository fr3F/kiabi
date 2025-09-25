const db = require("../../models");
const User = db.user;
let bcrypt = require("bcryptjs");
let fs = require("fs");
const emailService = require("../../config/environments/mysql/email.config");
let Handlebars = require("handlebars");
const helper = require("../../helpers/helpers.helper");
let jwt = require("jsonwebtoken");
const config = require("../../config/environments/mysql/auth.config");
// const
const {  Op } = require("sequelize/dist");
const { verifierAccesConnecte } = require("../acces/fonctionnalite.service");

// Generer un objet de type user
function genererUser(req, motDePasse = ""){
    if(motDePasse == "")
        motDePasse = req.body.motDePasse;
    let user = {
        // username: req.body.username,
        email: req.body.email,
        nom: req.body.nom,
        prenom: req.body.prenom,
        active: true,
        idRole: req.body.idRole,
        motDePasse: bcrypt.hashSync(motDePasse, 8),
        storeCode: req.body.storeCode
    };
    return user;
}

// Validate request
function validateRequestCreate(req){
    if (!req.body.email || !req.body.nom || !req.body.prenom || !req.body.idRole) {
            throw new Error("Veuillez renseigner tous les champs!");
    }
}

// Envoyer mot de passe par email
async function envoyerMotDePasseMail(email, motDePasse, nouveau = false){
    let subject = nouveau? "Nouveau mot de passe sodim": "Mot de passe sodim";
    let source;
    if(!nouveau)source =  fs.readFileSync("app/templates/password.html", "utf8");
    else source =  fs.readFileSync("app/templates/resetPassword.html", "utf8");
    let template = Handlebars.compile(source);
    let htmlContent = template({ motDePasse: motDePasse, email: email});
    await emailService.sendEmail(email, subject, htmlContent);
}

// generer mot de passe aleatoire
function generatePassword(){
    let password = Math.random().toString(36).substring(2, 10);
    return password;
}

// Verifier si l'email est deja utilisé
async function verifyMailUsed(email){
    let users  = await User.findAll({where: {email: email}});
    if(users.length != 0) throw new Error("Cet email est deja utilisé par un utilisateur") 
} 

// Verifier si le role existe
async function verifierRole(idRole){
    let role = await db.role.findByPk(idRole);
    if(!role)
        throw new Error("Veuillez renseigner un rôle valide")
}

// Creer user
async function createUser(req, res){
    validateRequestCreate(req);
    await verifyMailUsed(req.body.email);
    await verifierRole(req.body.idRole)
    let password = generatePassword();
    let user = genererUser(req, password);
    await User.create(user)
        .then(async (data) => {
            await envoyerMotDePasseMail(data.email, password, false);
            res.send({ message: "L'utilisateur a été enregistré avec succès !", id: data.id});
        });
}

// Valider requete upadte password
function validateRequestUpdatePassword(req){
    if(!req.body.newPassword || !req.body.oldPassword)
        throw new Error("Il y a un ou plusieurs champs vides");
}

// Modifier mot de passe utilisateur
async function modifyPassword(req, res){
    let id = req.params.id;
    if(!id)
        id = req.userId;
    validateRequestUpdatePassword(req);
    let user = await User.findByPk(id);
    if(!user) throw new Error("L'utilisateur n'existe pas");
    let passwordIsValid = bcrypt.compareSync(
        req.body.oldPassword.trim(),
        user.motDePasse
    );
    if(!passwordIsValid) throw new Error("L'ancien mot de passe est incorrect");
    let hashPwd = bcrypt.hashSync(req.body.newPassword, 8);
    await User.update({motDePasse: hashPwd}, {where: {id: id}});
    res.send({message: "OK"})
    // const newPassword = bcrypt.hashSync(req.body.password, 8);

}

// Reinitialiser le mot de passe d'un utilisateur(on envoye par mail le nouveau mot de passe)
async function resetPassword(id, res){
    let user = await User.findByPk(id);
    if(!user) throw new Error("L'utilisateur n'existe pas");
    let password = generatePassword();
    let userPass = {motDePasse: bcrypt.hashSync(password, 8)}
    User.update(userPass, {where: {id: id}})
    .then(async(resp) =>{
            await envoyerMotDePasseMail(user.email, password, true);
            res.send({message: "Mot de passe réinitialisé"});
        }
    )
}

// envoyer par mail le nouveau mot de passe(Reinitialisation) 
async function resetPasswordEmail(email, res){
    let user = await User.findOne({where: {email: email}});
    if(!user)
        throw new Error("Cet email n'est pas inscrit");
    resetPassword(user.id, res);
} 

// Validate request login
function validateRequestLogin(req){
    if (!req.body.email ||  !req.body.motDePasse) {
        throw new Error("Veuillez renseigner tous les champs!");
    }
}


function genererUserLogin(user, token){
    user = JSON.parse(JSON.stringify(user));
    user.motDePasse = undefined;
    user.token = token;
    return user;
}

// Traiter le resultat de login
function traitResultatLogin(user, req, res){
    if (!user) 
        throw new Error("Cet utilisateur n'existe pas ou desactivé. Veuillez vérifier l'email.")
    let passwordIsValid = bcrypt.compareSync(
        req.body.motDePasse.trim(),
        user.motDePasse
    );
    if(!passwordIsValid)
        throw new Error("Le mot de passe est incorrect!");
    let token = genererToken(user.id);
    let response = genererUserLogin(user, token);
    res.status(200).send(response);
}

// Génerer token 
function genererToken(id){
    let token = jwt.sign({ id: id}, config.secret, {
        // expiresIn: 86400, // 24 hours
        // expiresIn: 43200, // 12 hours
        expiresIn: 3600, // 1 hour
    });
    return token;
}

// Se connecter
function login(req, res){
    validateRequestLogin(req);
    User.findOne({
        where: {
            email: req.body.email,
            active: true
        },
		include: ["role"],
    }).then((result) => {
        traitResultatLogin(result, req, res);       
    }).catch((err) =>{
        // insertHistorique(null, "Connexion: " + err.message, null, null, 1, 3).then().catch();
        helper.sendError(res, err);
    })
}

// generer condition pour la recherche
function getFiltreRecherche(req){
    let filters = {};
    const searchQuery = req.query.search? req.query.search: '';
    const fields = ["nom", "prenom", "email"];  // les colonnes pour la recherche
    const value = { [Op.like]: `%${searchQuery}%` };
    fields.forEach((item) => (filters[item] = value));
    return filters;
}

// Rechercher les utilisateurs
async function rechercher(req, res){
    if(!await verifierAccesConnecte(3, req, res))
        return;   
    let { page, size } = req.query;
    page = page? page: 0;
    size = size? size: 10;
    const { limit, offset } = helper.getPagination(page, size);
    let filters = getFiltreRecherche(req);
    User.findAndCountAll({
        where: {
            [Op.or]: filters,
        },
        limit, offset
        ,include:["role"]
    })
        .then((data) => {
            res.send(helper.getPagingData(data, page, limit, "users"))
        })
        .catch((err) => {
            console.log(err)
            helper.sendErrorMessage(res, "Une erreur s'est produite lors de la récupération des utilisateurs");
        });
}

// Verifier si l'utilisateur existe
async function verifierUserExist(id){
    let user = await User.findByPk(id);
    if(!user)
        throw new Error("L'utilisateur n'existe pas");
    return user;
}

// Recuperer un utilisateur + role
function findOne(req, res){
    let id = req.params.id;
    User.findByPk(id, {include: ["role"]})
    .then(async (data) => {
        if (data) {
            res.send(data);
        } else {
            helper.sendErrorMessage(res, "Impossible de trouver l'utilisateur");
        }
    })
    .catch((err) => {
        console.log(err)
        helper.sendErrorMessage(res, "Erreur lors de la récupération de l'utilisateur")
    });
}

// Modifier un utilisateur
async function modifier(req, res){
    const id = req.params.id;
    if(id != req.userId && !await verifierAccesConnecte(3, req, res))
        return;   
    if(req.body.roleId != 3)
        req.body.clientId = null;
    User.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "L'utilisateur a été mis à jour avec succès.",
                });
            } else {
                helper.sendErrorMessage(res, `Impossible de mettre à jour l'utilisateur avec id=${id}. Peut-être que l'utilisateur n'a pas été trouvé !`)
            }
        })
        .catch((err) => {
            helper.sendErrorMessage(res, "Erreur lors de la modification de l'utilisateur")
        });
}

// changer status(active)
async function changeStatus(status, id, req, res){
    if(!await verifierAccesConnecte(4, req, res))
        return;   
    User.update({ active: status }, { where: { id: id } })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Statut modifié.",
                });
            } else {
                
                helper.sendErrorMessage(res, `Impossible de modifier le statut l'utilisateur avec id=${id}. Peut-être que l'utilisateur n'a pas été trouvé !`,);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erreur lors de la modification du statut de l'utilisateur avec id=" + id,
            });
        });
}

async function logDeconnexion(idUser){
    // await insertHistorique(idUser, "Déconnexion", null, null);
}

module.exports = {
    createUser,
    modifyPassword,
    resetPassword,
    resetPasswordEmail,
    login,
    rechercher,
    findOne,
    modifier,
    changeStatus,
    logDeconnexion
}