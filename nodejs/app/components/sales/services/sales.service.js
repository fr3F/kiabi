const { Op } = require("sequelize");
const { isDate } = require("../../../helpers/form.helper");
const { formatDate, verifierExistence } = require("../../../helpers/helpers.helper");
const { sequelize, Ticket } = require("../../../models");
const { findAndVerifyMagasin } = require("../../others/magasin/services/magasin.service");

// async function getTicketsByMagasin(idMagasin, date, withInclude = false) {
//     const magasin = await findAndVerifyMagasin(idMagasin);
//     verifyDate(date);
//     return await getDataTickets(magasin, date, withInclude);
// }


async function getTicketsByMagasin(idMagasin, date, withInclude = false) {
    const magasin = await findAndVerifyMagasin(idMagasin);
    verifyDate(date);
    const tickets = await getDataTickets(magasin, date, withInclude);
    const isEmpty = verifierDonneeCaisseVenteVide(tickets, idMagasin, date) 
    if(isEmpty)return[];
    return tickets;
}

function verifyDate(date){
    if(!isDate(date))
        throw new Error("La date n'est pas valide");
}

//fonction pour verifier la caisse vente vide
function verifierDonneeCaisseVenteVide(tickets, idMagasin, date){
    if(!tickets || tickets.length === 0){
        console.warn(`Aucune vente pour le magasin ${idMagasin} à la date ${date.toISOString().slice(0,10)}. Fichier non généré.`);
        // console.warn("Caisse vente vide → aucune insertion, aucun envoi de fichier.");    
        return true;
    }
    return false;
}

async function getDataTickets(magasin, date, withInclude){
    const include =  getIncludeTicket(withInclude)
    const where = getConditionTicket(magasin, date);
    const order = getOrderTicket();
    const tickets = await Ticket.findAll({
        include, 
        where,
        order
    });
    return tickets;
}

function getIncludeTicket(withInclude){
    if(!withInclude)
        return [];
    return [
        "articles",
        "reglements",
        "loyalty"
    ]
}

function getConditionTicket(magasin, date){
    date = formatDate(date, "YYYY-MM-DD");
    return {
        [Op.and]: [
            sequelize.where(sequelize.fn('DATE', sequelize.col('datecreation')), date),
            { 
                magasin: magasin.nommagasin,
            }
        ]
    }
}

function getOrderTicket(){
    return [
        ["nocaisse", "ASC"],
        ["numticket", "ASC"]
    ];
}

async function findTicketById(id){
    const include = ["articles", "reglements", "loyalty"];
    return await verifierExistence(Ticket, id, "Ticket", include, null, "idticket");
}

module.exports = {
    getTicketsByMagasin,
    findTicketById,
    verifierDonneeCaisseVenteVide
}