const { Op } = require("sequelize");
const { isDate } = require("../../helpers/form.helper");
const helper = require("../../helpers/helpers.helper");

const db = require("./../../models");
const { STATUT_ENCAISSEMENT } = require("./util");
const { selectSql } = require("../../helpers/db.helper");

const sequelize = db.sequelize;
const Encaissement = db.Encaissement;
const Magasin = db.Magasin;
const Ticket = db.Ticket;
const ItemEncaissement = db.itemencaissement;
const Historique = db.historique;

async function getEncaissementAvalider(idMagasin, date){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    let magasin = null;
    if(idMagasin)
        magasin = await helper.verifierExistence(Magasin, idMagasin, "Magasin");
    const where = [
        {statut: STATUT_ENCAISSEMENT.aValider},
        sequelize.where(sequelize.fn('date', sequelize.col('encaissement.createdAt')), sequelize.fn('date', date)),
    ]
    if(magasin)
        where.push({magasin: magasin.nommagasin});
    return await Encaissement.findAll({where: {[Op.and]: where}, include: ["caissier"]});
}

async function getDetailEncaissementAValider(idencaissement){
    const encaissement = await helper.verifierExistence(Encaissement, idencaissement, "Encaissement", ["caissier"], null, "idencaissement");
    encaissement.nbTickets = await Ticket.count({where: {idencaissement}});
    encaissement.reglements = await getReglementEncaissement(idencaissement);
    encaissement.billetages = await getBilletages(idencaissement);
    return encaissement;
}

async function getBilletages(idencaissement){
    return await ItemEncaissement.findAll({where: {idencaissement, type: 2}, order: [["monnaie", "DESC"]]});
}

async function getReglementEncaissement(idencaissement){
    const sql = `SELECT SUM(montantreglement) montant, modepaiement 
                    FROM v_reglements_encaissement
                    WHERE idencaissement = ${idencaissement}
                    GROUP BY modepaiement`;
    return await selectSql(sql);
}

async function valider(idencaissement, motif, especeRecu, user){
    if(isNaN(parseFloat(especeRecu)) || especeRecu < 0)
        throw new Error("Veuillez renseigner l'espèce réçu(nombre positif");
    const encaissement = await helper.verifierExistence(Encaissement, idencaissement, "Encaissement", null, null, "idencaissement");
    if(encaissement.statut != STATUT_ENCAISSEMENT.aValider) 
        throw new Error("L'encaissement n'est pas à valider");
    const montantEspece = await getMontantEspece(idencaissement);
    const ecart = especeRecu - montantEspece;
    if(especeRecu == montantEspece)
        motif = null;
    else if(!motif)
        throw new Error("Veuillez le motif de l'écart");
    await insererValidation(idencaissement, motif, especeRecu, ecart, user, encaissement);
}

async function insererValidation(idencaissement, motifEcart, especeRecu, ecart, user, encaissement){
    const update = {motifEcart, especeRecu, ecart, validePar: user.id, dateValidation: new Date(),
        statut: STATUT_ENCAISSEMENT.valide
    };
    const historique = {
        description: `Validation encaissement caisse n° ${encaissement.nocaisse}, ${encaissement.magasin}`,
        utilisateur: `${user.nom} ${user.prenom}`
    };
    await sequelize.transaction(async (transaction)=>{
        await Encaissement.update(update, {where: {idencaissement}, transaction});
        await Historique.create(historique, {transaction});
    })
}

async function getMontantEspece(idencaissement){
    const reglements = await getReglementEncaissement(idencaissement);
    let montantEspece = 0;
    const reglementEspece = reglements.find((r)=> r.modepaiement == "Espèces");
    if(reglementEspece)
        montantEspece = reglementEspece.montant;
    return montantEspece;
}

module.exports = {
    getEncaissementAvalider,
    getDetailEncaissementAValider,
    valider
}

