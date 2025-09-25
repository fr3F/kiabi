const { Op } = require("sequelize");
const { validerRequete, isDate } = require("../../../../helpers/form.helper");
const helper = require("../../../../helpers/helpers.helper");

const db = require("./../../../../models");
const { bulkCreateModePaiements } = require("../../parametrage/modepaiement/services/modepaiement.service");
const { generateUniqueFileName } = require("../../../../helpers/file.helper");
const { ErrorCode } = require("../../../../helpers/error");

const Magasin = db.Magasin;
const DepotMagasin = db.DepotMagasin;
const Modepaiement = db.ModePaiement;
const ModepaiementStandard = db.ModePaiementStandard;
const sequelize = db.sequelize;
const Monnaie = db.Monnaie;


const Depot = db.Depot;

const PATH_LOGO = __basedir + "/public/assets/images/logo-magasins/";

function verifierMagasin(body){
    const att = ["nommagasin", "code", "depotstockage", "depotlivraison", 
        "souche", "lastnumfact", "lastnumreglement", "identifiant", 
        "facebook", "siteweb", "horaireouvrable", "horaireweek", "nbChiffreNumFacture",
        "devise", "monnaies", "storeCode", "brn", "vat", "instagram"
    ];
    const nomAtt = ["Nom", "Code", "Dépôt stockage", "Dépôt livraison",
        "Souche", "Dernier numéro facture", "Dernier numéro règlement", "Identifiant",
         "Facebook", "Site web", "Horaire ouvrable", "Horaire week-end", "Nombre de chiffres numéro facture",
         "Devise", "Monnaies", "Store code", "BRN", "VAT", "Instagram"
    ];
    validerRequete(body, att, nomAtt);  
    verifyMonnaies(body.monnaies);
    verifyHoraireOuvrable(body.horaireouvrable);
    body.monnaies = JSON.stringify(body.monnaies); // On convertit les JSON en string(pour les insérer dans la base de données) 
    body.horaireouvrable = JSON.stringify(body.horaireouvrable);
    if(!isDate(body.dateDernierAppro))
        body.dateDernierAppro = null;
    if(isNaN(body.nbChiffreNumFacture) || body.nbChiffreNumFacture <= 0 || body.nbChiffreNumFacture > 11)
        throw new Error("Veuillez renseigner un nombre entre 1 et 11 pour le nombre de chiffres numéro facture");
}

// Verifier si l'attribut monnaies n'est pas un JSONµ
// {"monnaie":[20000,10000,5000,2000]}
function verifyMonnaies(monnaies){
    if(!monnaies)
        throw new Error("Monnaies invalide");
    if(!monnaies.monnaie || !Array.isArray(monnaies.monnaie))
        throw new Error("Monnaies invalide");
    for(const monnaie of monnaies.monnaie){
        if(!monnaie.lib)
            throw new ErrorCode("Veuillez renseigner les libellés pour les monnaies")
        if(!monnaie.montant)
            throw new ErrorCode("Veuillez renseigner le montant(libellé)");
        if(isNaN(monnaie.valeur) || monnaie.valeur <= 0)
            throw new ErrorCode("Les valeurs dans monnaies doivent être des nombres positifs");
    }
}

// Verifier si l'attribut horaireouvrable n'est pas un JSON
// {"horaire":[{"libelle":"Lundi au Jeudi","valeur":"10h00-20h30"}]}
function verifyHoraireOuvrable(horaires){
    if(!horaires)
        throw new Error("Horaire ouvrable invalide");
    if(!horaires.horaire || !Array.isArray(horaires.horaire))
        throw new Error("Horaire ouvrable invalide");
    for(const horaire of horaires.horaire){
        if(!horaire.libelle)
            throw new ErrorCode("Veuillez renseigner les libellés pour les horaires ouvrables");
        if(!horaire.valeur)
            throw new ErrorCode("Veuillez renseigner les valeurs pour les horaires ouvrables");
    }
}

async function createMagasin(body){
    await verifierMagasin(body);   
    const modepaiementStandards = await getAllModePaiementStandards();
    const modepaiements = generateModePaiements(modepaiementStandards, body.identifiant);
    let id;
    await helper.verifierAttributUnique(Magasin, null, "identifiant", "Identifiant");
    uploadLogoMagasin(body);
    await sequelize.transaction(async (transaction)=>{
        id = (await Magasin.create(body, {transaction})).id;
        await bulkCreateModePaiements(modepaiements, transaction);
        await insertDepotMagasins(body.idDepots, id, transaction);
    });
    return {id};
}

function uploadLogoMagasin(body){
    if(!body.logoFile)
        return;
    body.logo = generateUniqueFileName(".png");
    const path = PATH_LOGO + body.logo;
    helper.uploadFile(body.logoFile, path);
}

async function getAllModePaiementStandards(){
    const rep = await ModepaiementStandard.findAll();
    if(!rep.length)
        throw new Error("Veuillez d'abord ajouter des modes de paiement")
    return helper.dataToJson(rep);
}

function generateModePaiements(modepaiements, identifiant){
    const rep = []; 
    for(const modepaiement of modepaiements){
        rep.push(generateModePaiement(modepaiement, identifiant))
    }
    return rep;
}

function generateModePaiement(modepaiement, identifiant){
    const item = {...modepaiement}
    item.magasin = identifiant;
    delete item.id;
    return item;
}

async function updateMagasin(id, body){
    const oldMagasin  = await helper.verifierExistence(Magasin, id, "Magasin")
    await verifierMagasin(body);   
    await helper.verifierAttributUnique(Magasin, id, "identifiant", "Identifiant");
    uploadLogoMagasin(body);
    await sequelize.transaction(async (transaction)=>{
        await Magasin.update(body, {where: {id}, transaction});
        await Modepaiement.update( {magasin: body.identifiant},
            {where: {magasin: oldMagasin.identifiant}, transaction})
        await insertDepotMagasins(body.idDepots, id, transaction);
        // await bulkCreateModePaiements(paramReglements, transaction)
    });
    
    return body;
}

async function getModePaiements(magasin){
    return await Modepaiement.findAll({where: {magasin}})
}

async function getListMagasin(req){
    let { page, limit, offset } = helper.getVarNecessairePagination(req);
    let option = getOptionGetFacture(req, limit, offset);
    let rep = await Magasin.findAndCountAll(option);
    rep = helper.dataToJson(rep);
    return helper.getPagingData(rep, page, limit)
};

function getOptionGetFacture(req, limit, offset){
    let filters = getFiltreRecherche(req);
    let order = [['createdAt', 'DESC']]
    return {
        where: filters,
        limit, offset,
        order
    };
}

function getFiltreRecherche(req){
    let filters = helper.getFiltreRecherche(req, ["nommagasin", "code", "nummagasin"]);
    if(!req.query.search)
        filters = {};
    return filters;
}

async function findById(id){
    let rep = await helper.verifierExistence(Magasin, id, "Magasin", ["caisses", "depots"]);
    setDataMagasinToJson(rep, "monnaies", null);
    setDataMagasinToJson(rep, "horaireouvrable", {horaire: []});
    rep.paramreglements = await getModePaiements(rep.identifiant);
    return rep;
} 

// Converti les donnéés en JSON
function setDataMagasinToJson(magasin, column, defaultValue){
    try{
        magasin[column] = JSON.parse(magasin[column])
    }
    catch(err){
        magasin[column] = defaultValue;
    }
}

// function setMonnaiesToJson(magasin){
//     try{
//         magasin.monnaies = JSON.parse(magasin.monnaies)
//     }
//     catch(err){
//         console.log(err);
//         magasin.monnaies = null;
//     }
// }

function verifierModePaiement(body){
    const att = ["codejournal", "noreglement", "financingType"];
    const nomAtt = ["Code journal", "N° règlement", "Type de financement"];
    validerRequete(body, att, nomAtt);
    return {
        codejournal: body.codejournal, 
        noreglement: body.noreglement, 
        dateModification: new Date(),
        financingType: body.financingType
    };
}



async function updateModePaiement(id, body){
    await helper.verifierExistence(Modepaiement, id, "Mode de paiement");
    body = verifierModePaiement(body);
    await Modepaiement.update(body, {where: {id}});
    return {dateModification: new Date()};
}

async function findAllMagasin(){
    return await Magasin.findAll();
}

async function findAllMagasinGifi(){
    return await Magasin.findAll({where: {gifi: true}});
}


async function findAllMagasinUser(user){
    const userMagasins = await db.userMagasin.findAll({where: {idUser: user.id}});
    // if(!user.idMagasin)
    //     return await Magasin.findAll();
    // return await Magasin.findAll({where: {id: user.idMagasin}});
    if(!userMagasins.length)
        return await Magasin.findAll({
            include: ["caisses"],
            order: [[{model: db.caisse, as: "caisses"}, "nocaisse", "ASC"]]
    
        });
    const idMagasins = userMagasins.map((r)=> r.idMagasin);
    return await Magasin.findAll({where: {id: {[Op.in]: idMagasins}}, 
        include: ["caisses"],
        order: [[{model: db.caisse, as: "caisses"}, "nocaisse", "ASC"]]
    });
}

async function getCaisses(idMagasin){
    return await db.caisse.findAll({where: {idMagasin}, order: [["nocaisse", "ASC"]]});
}

async function updateEmailDepot(id, email){
    helper.validerEmail(email);
    await helper.verifierExistence(Depot, id, "Dépôt", [], null, "iddepot");
    await Depot.update({email}, {where: {iddepot: id}}) 
}

async function getAllDepots(){
    return await Depot.findAll();
}

async function insertDepotMagasins(idDepots, idMagasin, transaction){
    await DepotMagasin.destroy({where: {idMagasin}, transaction});
    if(!Array.isArray(idDepots) || !idDepots.length) return;
    const count = await Depot.count({where: {idDepot: {[Op.in]: idDepots}}});
    if(count != idDepots.length)
        throw new Error("Dépôts invalides")
    const tab = idDepots.map((r)=> {
        return {idMagasin, idDepot: r}
    });
    await DepotMagasin.bulkCreate(tab, {transaction});
}

async function findMagasinByIdentifiant(identifiant){
    return await helper.verifierExistence(Magasin, identifiant, "Magasin", [], null, "identifiant");
}

async function getAllMonnaies(){
    return await Monnaie.findAll();
}

module.exports = {
    createMagasin,
    getListMagasin,
    findById,
    updateMagasin,
    getModePaiements,
    updateModePaiement,
    findAllMagasinUser,
    findAllMagasin,
    getCaisses,
    getAllDepots,
    findAllMagasinGifi,
    findMagasinByIdentifiant,
    getAllMonnaies,
    updateEmailDepot
}