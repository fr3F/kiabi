const { validerRequete } = require("../../../../helpers/form.helper");
const { verifierExistence } = require("../../../../helpers/helpers.helper");
const db = require("./../../../../models");

const Caisse = db.Caisse;
const Magasin = db.Magasin;


async function verifierCaisse(body, id = null){
    const att = ["adresseIp", "nomBdd", "idMagasin", "nocaisse", "usernameBdd", "passwordBdd"];
    const nomAtt = ["Adresse ip", "Nom de la base de données", "Magasin", "Numéro", "Utilisateur de la base de données", "Mot de passe de la base de données"];
    validerRequete(body, att, nomAtt);
    await verifierExistence(Magasin, body.idMagasin, "Magasin");
    await verifierNumero(body.nocaisse, body.idMagasin, id)
}

async function verifierNumero(nocaisse, idMagasin, id){
    const caisse = await Caisse.findOne({where: {nocaisse, idMagasin}});
    if(caisse && caisse.id != id){
        throw new Error("Ce numéro est déjà utilisé");
    }
}

async function createCaisse(body){
    await verifierCaisse(body);   
    body.count = 0;
    body.status = 1;
    body.connected = true;
    let id;
    await db.sequelize.transaction(async (transaction)=>{
        id = (await Caisse.create(body, {transaction})).id;
    });
    body.id = id;
    return body;
}

async function updateCaisse(id, body){
    await verifierExistence(Caisse, id, "Caisse");
    await verifierCaisse(body, id);   
    await Caisse.update(body, {where: {id}});
    return  body;
}

module.exports = {
    createCaisse,
    updateCaisse,
}