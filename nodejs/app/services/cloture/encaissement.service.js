const db = require("../../models");
const helper = require("../../helpers/helpers.helper");
const { Op, QueryTypes } = require("sequelize");
const { getCaisseSync } = require("../caisse/util.service");
const { isDate } = require("../../helpers/form.helper");

const sequelize = db.sequelize;
const Encaissement = db.Encaissement;
const ItemEncaissement = db.itemencaissement;
const Prelevement = db.Prelevement;
const Ticket = db.Ticket;
const ArticleTicket = db.ArticleTicket;
const Caisse = db.Caisse;
const Magasin = db.Magasin;
const LogCaisse = db.logCaisse;

const mysql2 = require('mysql2');
const { getConditionOrMultiple, selectSql } = require("../../helpers/db.helper");
const { generateReglementPdf } = require("./impression.service");
const { PATH_REGLEMENTS } = require("../../config/environments/mysql/environment");
const { ErrorCode } = require("../../helpers/error");
const { formatDateSql } = require("../../helpers/date.helper");

async function deleteEncaissement(id){
    const encaissement = await helper.verifierExistence(Encaissement, id, "Encaissement", ["tickets"], null, "idencaissement");
    await sequelize.transaction(async (transaction)=> {
        await deleteTickets(id, encaissement.tickets, transaction);
        await ItemEncaissement.destroy({where: {idencaissement: id}, transaction})
        await Encaissement.destroy({where: {idencaissement: id}, transaction})
    })
}

//getAllEncaissements
async function getAllEncaissements(){
    const sql = `SELECT * FROM encaissement`;
    const rep = await sequelize.query(sql, {type: QueryTypes.SELECT});
    return rep;
}

async function deleteTickets(idencaissement, tickets, transaction){
    if(!tickets.length)
        return;
    let idtickets = helper.getValeurAttribut("idticket", tickets);
    await ArticleTicket.destroy({where: {idticket: {[Op.or]: idtickets}}, transaction});
    await deleteReglements(idtickets, transaction);
    await Ticket.destroy({where: {idencaissement}, transaction});
}

async function deleteReglements(idtickets, transaction){
    let condition = "idticket = '" + idtickets.join("' OR idticket = '") + "'";
    const sql = `DELETE FROM reglement WHERE ` + condition;
    await sequelize.query(sql, {type: QueryTypes.DELETE, transaction});
}

async function getEncaissementsCaisse(idcaisse, date) {
    const sql = getSqlEncaissementCaisse(date);    
    const { caisse, destDBConfig } = await getCaisseSync(idcaisse);
    let connection;

    try {
        connection = mysql2.createConnection({ ...destDBConfig, connectTimeout: 10000 });
      
        await connection.promise().connect(); // Important : établir la connexion explicitement

      
        const res = await connection.promise().query(sql);
        await setMontantTicketCentral(res[0], caisse);
        return res[0];
    } catch (err) {
        console.error("Erreur dans getEncaissementsCaisse :", err.message);
        throw new Error("Impossible de se connecter à la base de données");
    } finally {
        endConnection(connection);
    }
}


async function setMontantTicketCentral(encaissements, caisse){
    for(const encaissement of encaissements){
        encaissement.montantTicketCentral = await getMontantTicketCentral(encaissement, caisse);
    }
}

// async function getMontantTicketCentral(encaissement, caisse){
//     encaissement.endAt = encaissement.endAt == 'Invalid Date'? new Date(): encaissement.endAt;
//     const endAt = helper.formatDate(encaissement.endAt, 'YYYY-MM-DD HH:mm:ss');
//     const createdAt = helper.formatDate(encaissement.createdAt, 'YYYY-MM-DD HH:mm:ss');
//     const sql = `SELECT SUM(montanttotal) montanttotal FROM ticket 
//                     WHERE nocaisse = '${caisse.nocaisse}' AND magasin = '${caisse.magasin.nommagasin}'
//                         AND datecreation >= '${createdAt}' AND datecreation <= '${endAt}'`;
    
//     console.log("sql",sql);
    
//                         const rep = await selectSql(sql);
//     return rep[0].montanttotal;
// }

async function getMontantTicketCentral(encaissement, caisse) {
    const isInvalidDate = (date) => {
        const d = new Date(date);
        return isNaN(d.getTime());
    };

    const endAtDate = isInvalidDate(encaissement.endAt) ? new Date() : new Date(encaissement.endAt);
    const createdAtDate = isInvalidDate(encaissement.createdAt) ? new Date() : new Date(encaissement.createdAt);

    const endAt = helper.formatDate(endAtDate, 'YYYY-MM-DD HH:mm:ss');
    const createdAt = helper.formatDate(createdAtDate, 'YYYY-MM-DD HH:mm:ss');

    const sql = `SELECT SUM(montanttotal) montanttotal FROM ticket 
                    WHERE nocaisse = '${caisse.nocaisse}' AND magasin = '${caisse.magasin.nommagasin}'
                        AND datecreation >= '${createdAt}' AND datecreation <= '${endAt}'`;

    const rep = await selectSql(sql);
    return rep[0]?.montanttotal || 0;
}


function endConnection(connection) {
    try{
        if(connection)
          connection.end(); 
      }
      catch(err){
        console.log(err)
        throw new Error("Impossible de se connecter à la base de données");
    }
}



function getSqlEncaissementCaisse(date){
    if(!isDate(date))   
        throw new Error("Veuillez renseigner la date");
    date = helper.formatDate(new Date(date), 'YYYY-MM-DD')
    return `SELECT e.*, COALESCE(nbTicket, 0) nbTicket, COALESCE(montantTotal, 0) montantTotal 
                FROM encaissement e
                LEFT JOIN (
                    SELECT COUNT(idticket) nbTicket, SUM(montanttotal) montantTotal, idencaissement
                    FROM ticket GROUP BY idencaissement
                ) t ON(e.idencaissement = t.idencaissement)
            WHERE DATE(createdAt) = DATE('${date}')
    `;
}

// Chargement encaissement par idcaisse et idencaissement
async function chargerEncaissementCaisse(idcaisse, idencaissement, verifyStatus = true){
    const data = await getDataCaisseTransfert(idcaisse, idencaissement, verifyStatus);
    const caisse = await helper.verifierExistence(Caisse, idcaisse, "Caisse", ["magasin"]);
    const magasin = caisse.magasin;
    return await chargerEncaissementBdd(data, magasin); 
}

// Chargement encaissement par données JSON
async function chargerEncaissementJSON(encaissement){
    validateEncaissementJSON(encaissement);
    encaissement.statut = "A valider";
    const magasin = await helper.verifierExistence(Magasin, encaissement.magasin, "Magasin", [], null, "nommagasin");
    const reglements = getReglementsJSON(encaissement.tickets);
    const articleTickets = getArticleticketsJSON(encaissement.tickets);
    const logCaisses = encaissement.logCaisses?? [];
    const data = {
        encaissement,
        itemEncaissements: encaissement.itemencaissements,
        prelevements: encaissement.prelevements,
        tickets: encaissement.tickets,
        reglements,
        articleTickets,
        logCaisses
    }
    return await chargerEncaissementBdd(data, magasin); 
}

// Recuperer les reglements des tickets
function getReglementsJSON(tickets){
    let reglements = [];
    for(const ticket of tickets)
        reglements = reglements.concat(ticket.reglements);
    return reglements;
}

// Recuperer les articles des tickets
function getArticleticketsJSON(tickets){
    let articles = [];
    for(const ticket of tickets)
        articles = articles.concat(ticket.articletickets);
    return articles;
}

function validateEncaissementJSON(encaissement){
    if(!encaissement)
        throw new Error("Données invalides");
    if(!encaissement.itemencaissements)
        throw new Error("Item encaissements non renseignés");
    if(!encaissement.prelevements)
        throw new Error("Prélèvements non renseignés");
    if(!encaissement.tickets)
        throw new Error("Tickets non renseignés");
}

// Charger encaissement dans la base de données
// data: {encaissement, itemEncaissements, prelevements, tickets, reglements, articleTickets}
async function chargerEncaissementBdd(data, magasin){
    await verifyAndEnableClotureCaisseMagasin(magasin);
    try{
        return await chargerEncaissementBddWithoutTest(data, magasin);
    }
    catch(err){
        throw err;
    }
    finally{
        await disableClotureCaisseMagasin(magasin);
    }
}

async function verifyAndEnableClotureCaisseMagasin(magasin) {
    magasin = await helper.verifierExistence(Magasin, magasin.id, "Magasin");
    if(magasin.clotureCaisse)
        throw new ErrorCode("Une autre caisse est en cours de clôture");
    await updateClotureCaisseMagasin(magasin, true);
}

async function disableClotureCaisseMagasin(magasin) {
    await updateClotureCaisseMagasin(magasin, false);
}

async function updateClotureCaisseMagasin(magasin, clotureCaisse) {
    await Magasin.update({clotureCaisse}, { where: {id: magasin.id}});    
}

async function chargerEncaissementBddWithoutTest(data, magasin){
    await sequelize.transaction(async (transaction)=>{
        const idencaissement = await insertEncaissement(data.encaissement, transaction);
        await insertItemEncaissements(data.itemEncaissements, idencaissement, transaction);
        await insertPrelevements(data.prelevements, idencaissement, transaction);
        await insertTickets(data.tickets, idencaissement, data.reglements, data.articleTickets, magasin, transaction);
        await Magasin.update({lastnumreglement: magasin.lastnumreglement}, {where: {id: magasin.id}, transaction});
        await insertLogCaisses(data.logCaisses, transaction);
        await generateReglementPdf(idencaissement, null, PATH_REGLEMENTS, transaction);
    })
    return {
        reglements: data.reglements.length, 
        tickets: data.tickets.length,
        articleTickets: data.articleTickets.length,
        itemEncaissements: data.itemEncaissements.length
    }
}

async function chargerEncaissementCaisse2(identifiantMagasin, nocaisse, idencaissement){
    const magasin = await helper.verifierExistence(db.magasin, identifiantMagasin, "Magasin", ["caisses"], null, "identifiant");
    const caisse = magasin.caisses.find((r)=> r.nocaisse == nocaisse);
    if(!caisse)
        throw new Error("Caisse introuvable");
    return await chargerEncaissementCaisse(caisse.id, idencaissement, false);
}

async function getDataCaisseTransfert(idcaisse, idencaissement, verifyStatus = true){
    const {caisse, destDBConfig} = await getCaisseSync(idcaisse)
    
    let connection = null;
    try{
        connection = mysql2.createConnection(destDBConfig);
        
        const encaissement = await getEncaissementDbCaisse(connection, idencaissement, caisse, verifyStatus);
        const itemEncaissements = await getItemEncaissementDbCaisse(connection, idencaissement);
        const prelevements = await getPrelevementDbCaisse(connection, idencaissement);
        const tickets = await getTicketsDbCaisse(connection, idencaissement);
        const idTickets = await helper.getValeurAttribut("idticket", tickets);
        const articleTickets = await getArticleTicketsDbCaisse(connection, idTickets);
        const reglements = await getReglementsDbCaisse(connection, idTickets);
        const logCaisses = await getLogCaisseDbCaisse(connection, encaissement);
        return {encaissement, itemEncaissements, tickets, articleTickets, reglements, prelevements, logCaisses};
    }
    catch(err){
        if(err.message.includes("existent"))
            throw err;
        throw err;
    }
    finally{
        endConnection(connection);
    }
}


async function getEncaissementDbCaisse(connection, idencaissement, caisse, verifyStatus = true){
    const sql = `SELECT * FROM kiabi.encaissement WHERE idencaissement = ${idencaissement}`;
    console.log("destDBConfig", connection.config);

    const rep = await connection.promise().query(sql);
    if(!rep[0].length)
        throw new Error("Encaissement introuvable");
    if(rep[0][0].statut != "Clos" && verifyStatus)
        throw new Error("Encaissement non clos")
    const encaissement = rep[0][0];
    const montantTicketCentral = await getMontantTicketCentral(encaissement, caisse);
    if(montantTicketCentral)
        throw new Error("Des tickets existent déjà");
    return encaissement;
}

async function getTicketsDbCaisse(connection, idencaissement){
    const sql = `SELECT * FROM ticket WHERE idencaissement = ${idencaissement}`;
    return await selectDbCaisse(connection, sql);
}

async function getArticleTicketsDbCaisse(connection, idTickets){
    if(!idTickets.length)
        return [];
    const sql = `SELECT * FROM articleticket WHERE ${getConditionOrMultiple(idTickets, 'idticket')}`;
    return await selectDbCaisse(connection, sql);
}

async function getReglementsDbCaisse(connection, idTickets){
    if(!idTickets.length)
        return [];
    const sql = `SELECT * FROM reglement WHERE ${getConditionOrMultiple(idTickets, 'idticket')}`;
    return await selectDbCaisse(connection, sql);
}

async function getItemEncaissementDbCaisse(connection, idencaissement){
    const sql = `SELECT * FROM itemencaissement WHERE idencaissement = ${idencaissement}`;
    return await selectDbCaisse(connection, sql);
}

async function getPrelevementDbCaisse(connection, idencaissement){
    const sql = `SELECT * FROM prelevement WHERE idencaissement = ${idencaissement}`;
    return await selectDbCaisse(connection, sql);
}

async function getLogCaisseDbCaisse(connection, encaissement){
    const condition = makeConditionLogCaisse(encaissement);
    const sql = `SELECT * FROM logs_caisse 
                    WHERE ${condition}`;
    return await selectDbCaisse(connection, sql);
}

// function makeConditionLogCaisse(encaissement){
//     const createdAt = formatDateSql(encaissement.createdAt);
//     const endAt = formatDateSql(encaissement.endAt);
//     return ` timestamp BETWEEN ${mysql2.escape(createdAt)} AND ${mysql2.escape(endAt)} `
// }


function makeConditionLogCaisse(encaissement) {

    if (!encaissement.createdAt || !encaissement.endAt) {
        throw new Error("encaissement.createdAt ou encaissement.endAt est invalide");
    }

    const createdAt = formatDateSql(encaissement.createdAt);
    const endAt = formatDateSql(encaissement.endAt);

    return ` timestamp BETWEEN ${mysql2.escape(createdAt)} AND ${mysql2.escape(endAt)} `;
}


async function selectDbCaisse(connection, sql){
    const rep = await connection.promise().query(sql);
    return rep[0];
}

async function insertEncaissement(encaissement, transaction){
    encaissement.idencaissement = undefined;
    const data = await Encaissement.create(encaissement, {transaction});
    return data.idencaissement;
}

async function insertTicket(ticket, idencaissement, reglements, articletickets, transaction){
    const oldIdticket = ticket.idticket; 
    ticket.idticket = undefined;
    ticket.idencaissement = idencaissement;
    const data = await Ticket.create(ticket, {transaction});
    await insertArticletickets(data, ticket, oldIdticket, articletickets, transaction);
    await insertReglements(data, ticket, oldIdticket, reglements, transaction);
}

async function insertArticletickets(data, ticket, oldIdticket, articletickets, transaction) {
    const articles = ticket.articletickets?? getDataTickets(oldIdticket, articletickets, data.idticket, "idarticleticket");
    if(articles.length){
        deleteColumnList(articles, "idarticleticket", data.idticket);
        await ArticleTicket.bulkCreate(articles, {transaction});
    }
}

async function insertReglements(data, ticket, oldIdticket, reglements, transaction) {
    const regles = ticket.reglements?? getDataTickets(oldIdticket, reglements, data.idticket, "idreglement");
    if(regles.length){
        deleteColumnList(regles, "idreglement", data.idticket);
        await sequelize.queryInterface.bulkInsert("reglement", regles, {transaction});
    }    
}

// Delete column from list and add idticket
function deleteColumnList(list, column, idticket){
    for(let item of list){
        delete item[column];
        item.idticket = idticket;
    }
}

function setNumeroReglements(reglements, magasin){
    let code = magasin.code? magasin.code: "";  
    let lastnum = 0;
    const suffix = "R" + code; 
    const length = 10 - suffix.length;
    if(magasin.lastnumreglement){
        magasin.lastnumreglement = magasin.lastnumreglement.replace("R", "")
        magasin.lastnumreglement = magasin.lastnumreglement.replace(code, "")
        lastnum = parseInt(magasin.lastnumreglement);
    }
    
    for(let reglement of reglements){
        lastnum ++;
        reglement.numreglement = suffix + ((lastnum + "").padStart(length, "0"));        
    }
    magasin.lastnumreglement = suffix + ((lastnum + "").padStart(length, "0"));;
}


async function insertTickets(tickets, idencaissement, reglements, articletickets, magasin, transaction){
    setNumeroReglements(reglements, magasin);
    for(const ticket of tickets)
        await insertTicket(ticket, idencaissement, reglements, articletickets, transaction);
}

async function insertItemEncaissements(items, idencaissement, transaction){
    for(const item of items){
        item.id = undefined;
        item.idencaissement = idencaissement;
    }
    if(items.length)    
        await ItemEncaissement.bulkCreate(items, {transaction});
}

async function insertPrelevements(prelevements, idencaissement, transaction){
    for(const item of prelevements){
        item.idprelevement = undefined;
        item.idencaissement = idencaissement;
    }
    if(prelevements.length)    
        await Prelevement.bulkCreate(prelevements, {transaction});
}

async function insertLogCaisses(logCaisses, transaction){
    for(const item of logCaisses){
        delete item.id;
    }
    if(logCaisses.length)    
        await LogCaisse.bulkCreate(logCaisses, {transaction});
}

function getDataTickets(oldIdticket, data, idticket, nameId){
    const resp = data.filter(r => r.idticket == oldIdticket);
    for(const item of resp){
        item.idticket = idticket;
        item[nameId] = undefined;
    }
    return resp;
}
module.exports = {
    getAllEncaissements,
    deleteEncaissement,
    getEncaissementsCaisse,
    chargerEncaissementCaisse,
    chargerEncaissementCaisse2,
    chargerEncaissementJSON
}