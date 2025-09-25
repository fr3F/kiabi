const { isDate } = require("../../helpers/form.helper");
const { formatDate } = require("../../helpers/helpers.helper");
const { getDataMagasinDb } = require("../dashboard/util.service");
const { calculPrixArticle } = require("../reporting/reporting.service");

const { getCaisseSync, pingCaisse, endConnection } = require("./util.service");

const mysql2 = require('mysql2');

async function getTicketsCaisse(id, debut, fin){
    verifierDate(debut, fin);
    const {caisse, destDBConfig} = await getCaisseSync(id);
    const ticketMagasins = await getTicketsMagasin(caisse.magasin, caisse.nocaisse, debut, fin);
    const ping = await pingCaisse(caisse);  // Tester si la caisse est pingable
    if(!ping)
        throw new Error("Impossible de se connecter à la caisse");
    return await getTicketsBddCaisse(destDBConfig, debut, fin, ticketMagasins);
}

function verifierDate(debut, fin){
    if(!isDate(debut) || !isDate(fin))
        throw new Error("Veuillez renseigner des dates valides");
    if(new Date(debut) > new Date(fin))
        throw new Error("La date de début doit être avant la date de fin"); 
}

async function getTicketsBddCaisse(destDBConfig, debut, fin, ticketMagasins){
    const sql = getSqlTickets(debut, fin);
    let connection = null;
    try{
            connection = mysql2.createConnection(destDBConfig);
            await connection.promise().connect();
            const res = await connection.promise().query(sql);
            const tickets = res[0];
            setTicketMagasins(tickets, ticketMagasins);
            return tickets;
    }
    catch(err){
        console.log(err)
        throw new Error("Une erreur s'est produite lors de la récupération des données")
    }
    finally{
        endConnection(connection);
    }
}

function setTicketMagasins(tickets, ticketMagasins){
    for(const ticket of tickets){
        const ticketMagasin = ticketMagasins.find((r)=> r.numticket == ticket.numticket);
        ticket.ticketMagasin = ticketMagasin != null;
    }
}

function getSqlTickets(debut, fin){
    debut = formatDate(debut, "YYYY-MM-DD");
    fin = formatDate(fin, "YYYY-MM-DD");
    const sql = `SELECT *
                    FROM ticket  
                WHERE DATE(datecreation) >= DATE('${debut}') 
                        AND DATE(datecreation) <= DATE('${fin}')
                ORDER BY numticket ASC`;
    return sql;
}

async function findTicketByIdFromCaisse(id, idCaisse){
    const {caisse, destDBConfig} = await getCaisseSync(idCaisse);
    const ping = await pingCaisse(caisse);  // Tester si la caisse est pingable
    if(!ping)
        throw new Error("Impossible de se connecter à la caisse");
    return await findTicketByIdBddCaisse(destDBConfig, id);
}

async function findTicketByIdBddCaisse(destDBConfig, id){
    id = mysql2.escape(id);
    const sqlTicket = getSqlFindByIdTicket(id, "ticket");
    const sqlArticle = getSqlFindByIdTicket(id, "articleticket");
    const sqlReglement = getSqlFindByIdTicket(id, "reglement");
    let connection = null;
    let ticket = null;
    try{
            connection = mysql2.createConnection(destDBConfig);
            await connection.promise().connect();
            const dataTickets = await getDataByConnection(connection, sqlTicket);
            if(dataTickets.length){
                ticket = dataTickets[0];
                ticket.articles = await getDataByConnection(connection, sqlArticle);
                calculPrixArticle(ticket.articles);
                ticket.reglements = await getDataByConnection(connection, sqlReglement);    
            }
    }
    catch(err){
        console.log(err)
        throw new Error("Une erreur s'est produite lors de la récupération des données")
    }
    finally{
        endConnection(connection);
    }
    if(!ticket)
        throw new Error("Ticket introuvable")
    return ticket;
}

async function getDataByConnection(connection, sql){
    const res = await connection.promise().query(sql);
    return  res[0];
}

function getSqlFindByIdTicket(id, table){
    return `SELECT * 
                FROM ${table}
                WHERE idticket = ${id}`
}


async function getTicketsMagasin(magasin, nocaisse, debut, fin){
    debut = formatDate(debut, "YYYY-MM-DD");
    fin = formatDate(fin, "YYYY-MM-DD");
    const where = `DATE(datecreation) >= DATE('${debut}') 
                    AND DATE(datecreation) <= DATE('${fin}')
                     AND nocaisse = '${nocaisse}'`;
    const sql = `SELECT * FROM ticket WHERE ${where} `;
    return await getDataMagasinDb(magasin, sql);
}

module.exports = {
    getTicketsCaisse,
    findTicketByIdFromCaisse
}