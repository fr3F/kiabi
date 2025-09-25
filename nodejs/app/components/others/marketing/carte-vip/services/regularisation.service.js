const { Op } = require("sequelize");
const { Ticket, HistoriquePointVip } = require("../../../../../models");
const { findAndVerifyClientVip } = require("./carte-vip.service");

async function getTicketsToRegularize(numClient) {
    const client = await findAndVerifyClientVip(numClient);
    const allTickets = await getAllTicketValids(client);
    if(!allTickets.length)
        return [];
    const historiques = await getHistoriquePoints(allTickets, client);
    return getTicketsWithoutHistory(allTickets, historiques);
}

async function getAllTicketValids(client) {
    return await Ticket.findAll({
        where: {
            clientvip: client.numClient,
            datecreation: {[Op.between]: [client.dateActivation, client.dateExpiration]}
        },
        order: [['datecreation', 'ASC']]
    });
}    

async function getHistoriquePoints(allTickets, client) {
    const numtickets = allTickets.map((r)=> r.numticket);
    return await HistoriquePointVip.findAll({
        where: {
            numticket: {[Op.in]: numtickets},
            numClient: client.numClient        
        }
    })
}

function getTicketsWithoutHistory(allTickets, historiques){
    const resp = [];
    for(const ticket of allTickets){
        const historique = findHistoryTicket(ticket, historiques);
        if(!historique)
            resp.push(ticket);
    }
    return resp;
}

function findHistoryTicket(ticket, historiques){
    return historiques.find((h)=> {
        return h.numticket == ticket.numticket && h.nocaisse == ticket.nocaisse && 
            ticket.magasin == h.magasin 
    });
}

module.exports = {
    getTicketsToRegularize
}