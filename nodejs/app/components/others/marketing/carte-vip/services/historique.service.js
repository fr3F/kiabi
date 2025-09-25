const { Op } = require("sequelize");
const { executeSql } = require("../../../../../helpers/db.helper");
const { HistoriquePointVip, Sequelize } = require("../../../../../models");

async function insertHistoriquePoint(clientVip, numticket, magasin, nocaisse, pointApres, equivalence, transaction, ticket) {
    const history = generateHistory(clientVip, numticket, magasin, nocaisse, pointApres, equivalence);
    if(ticket)
        history.createdAt = ticket.datecreation;
    await HistoriquePointVip.create(history, {transaction});
}

function generateHistory(clientVip, numticket, magasin, nocaisse, pointApres, equivalence){
    const pointAvant = clientVip.point;
    const numClient = clientVip.numClient;
    const { equivalenceConso, equivalenceAjout } = equivalence;
    return { numClient, numticket, magasin, nocaisse, pointApres, pointAvant,
        equivalenceConso, equivalenceAjout 
    };
}

async function initAllHistory(transaction) {
    const sql = makeSqlInit();
    await executeSql(sql, transaction);
}

function makeSqlInit(){
     return `INSERT INTO historique_point_vip 
                (numClient, pointApres, createdAt, updatedAt, equivalenceConso, equivalenceAjout)
            SELECT numClient, 0 AS pointApres, NOW() AS createdAt, NOW() AS updatedAt,
                    p.equivalenceConso, p.equivalenceAjout
                FROM clientvip c 
                    JOIN parametrage_vip p ON(1=1)
                    WHERE c.dateExpiration <= NOW()
                `
}

async function updateOldHistories(pointToAdd, numClient, ticket, transaction) {
    if(ticket){
        const data = makeDataUpdateOldHistory(pointToAdd);
        const where = makeConditionUpdateOldHistory(numClient, ticket);
        await HistoriquePointVip.update(data, { where, transaction });    
    }
}

function makeDataUpdateOldHistory(pointToAdd){
    return { 
        pointAvant: Sequelize.literal(`pointAvant + ${pointToAdd}`),
        pointApres: Sequelize.literal(`pointApres + ${pointToAdd}`),
    };
}

function makeConditionUpdateOldHistory(numClient, ticket){
    return {
        numClient,
        createdAt: {
          [Op.gt]: new Date(ticket.datecreation)
        }
    }
}

async function insertHistoriquePointAdd(pointToAdd, clientVip, ticket, equivalence, transaction) {
    const pointAvant = await getPointAvant(clientVip, ticket);
    const pointApres = parseInt(pointAvant) + parseInt(pointToAdd);
    const  history = generateHistoryForAdd(clientVip, ticket, equivalence, pointAvant, pointApres);
    await HistoriquePointVip.create(history, {transaction});
}

async function getLastHistoryBeforeTicket(clientVip, ticket) {
    const where = makeConditionLastHistory(clientVip, ticket);
    return await HistoriquePointVip.findOne({
        where,
        order: [["createdAt", "DESC"], ["id", "DESC"]]
    });    
}

function makeConditionLastHistory(clientVip, ticket){
    return {
        numClient: clientVip.numClient,
        createdAt: {
            [Op.and]: [
                { [Op.between]: [clientVip.dateActivation, clientVip.dateExpiration] },
                { [Op.lte]: ticket.datecreation }
            ]
        }
    }
}

async function getPointAvant(clientVip, ticket){
    const lastHistory = await getLastHistoryBeforeTicket(clientVip, ticket);
    let pointAvant = lastHistory? lastHistory.pointApres: clientVip.point;
    if(new Date(clientVip.dernierAchat) > new Date(ticket.datecreation))
        pointAvant = 0;
    return pointAvant;
}

function generateHistoryForAdd(clientVip, ticket, equivalence, pointAvant, pointApres){
    const numClient = clientVip.numClient;
    const { numticket, magasin, nocaisse } = ticket;
    const createdAt = ticket.datecreation;
    const { equivalenceConso, equivalenceAjout } = equivalence;
    return { numClient, numticket, magasin, nocaisse, pointApres, pointAvant,
        equivalenceConso, equivalenceAjout, createdAt 
    };
}

module.exports = {
    insertHistoriquePoint,
    initAllHistory,
    updateOldHistories,
    insertHistoriquePointAdd
}