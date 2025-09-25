const { verifierExistence, formatDate } = require("../../helpers/helpers.helper");
const { magasin: Magasin } = require("../../models");
const { getDataMagasinDb, getDbConfigMagasin } = require("../dashboard/util.service");
const { updateStockMagasinVente } = require("../util/stocks/stock-magasin.service");
const { findTicketByIdFromCaisse } = require("./consultation-ticket.service");
const { getCaisseSync, endConnection, getSqlInsert } = require("./util.service");
const mysql2 = require('mysql2');

const TABLE_TICKET = {
    nom: "ticket",
    colonnes: "datecreation,nocaisse,namecaissier,montanttotal,nbarticle,montantht,montanttva,modepaiement,codeclient,recu,arendre,magasin,numticket,montantremise,idencaissement,createdAt,updatedAt,numerocheque,isclos,codejournal,nomodereglement,depot,numeroFacture,ventedepot,clientvip,hash,duration,crypto"
};
const TABLE_ARTICLE = {
    nom: "articleticket",
    colonnes: "noligne,code,designation,prixdevente,quantite,prixtotal,idticket,montantremise,createdAt,updatedAt,gamme,articlelocaux,codecategorie,codegamme,codeunivers,codegifi,libellecourt,tauxtva,numerodeserie,codeean,scannedQuantity,isFree,origTransactionType"
};
const TABLE_REGLEMENT = {
    nom: "reglement",
    colonnes: "idticket,montant,modepaiement,typepaiement,numerocheque,codejournal,nomodereglement,dateModification,numreglement,amountValue"
};


async function verifyTicketMagasin(magasin, nocaisse, numticket){
    const where = ` numticket = '${numticket}' AND nocaisse = '${nocaisse}'`;
    const sql = `SELECT * FROM ticket WHERE ${where} `;
    const tickets = await getDataMagasinDb(magasin, sql);
    // if(tickets.length)
    if (Array.isArray(tickets) && tickets.length > 0)
        throw new Error("Cet ticket est déjà charger");
}


async function chargerTicketMagasinByNoCaisse(idticket, nocaisse, identifiantMagasin) {
    const magasin = await findAndVerifyMagasin(identifiantMagasin);
    const caisse = findAndVerifyCaisseMagasin(magasin, nocaisse);
    await chargerTicketMagasin(idticket, caisse.id, false);
}

async function findAndVerifyMagasin(identifiant){
    return await verifierExistence(Magasin, identifiant, "Magasin", ["caisses"], null, "identifiant");
}

function findAndVerifyCaisseMagasin(magasin, nocaisse){
    const caisse = magasin.caisses.find((r) => r.nocaisse == nocaisse);
    if(!caisse)
        throw new Error("Caisse introuvable");
    return caisse;
}

async function chargerTicketMagasin(id, idCaisse, updateStock = false){
    const ticket = await findTicketByIdFromCaisse(id, idCaisse);
    const {caisse} = await getCaisseSync(idCaisse);
    const articles = ticket.articles;
    await verifyTicketMagasin(caisse.magasin, caisse.nocaisse, ticket.numticket);
    await insertTicket(ticket, caisse.magasin);
    await updateStockVente(ticket, caisse, articles, updateStock);
}

async function updateStockVente(ticket, caisse, articles, updateStock) {
    if(!updateStock || ticket.ventedepot || !isTodaysTicket(ticket))
        return;
    await updateStockMagasinVente(caisse.magasin.depotstockage, articles);    
}

function isTodaysTicket(ticket){
    const date = formatDate(new Date(), 'DD-MM-YYYY');
    const dateTicket = formatDate(new Date(ticket.datecreation), 'DD-MM-YYYY');
    return date == dateTicket;
}

async function insertTicket(ticket, magasin){
    const dbConfig = getDbConfigMagasin(magasin);
    const articles = ticket.articles;
    const reglements = ticket.reglements;
    let connection = null;
    try{
        connection = mysql2.createConnection(dbConfig);  
        await connection.promise().beginTransaction();
        const idTicket = await insertTicketBdd(connection, ticket);
        await insertArticleTicketBdd(connection, idTicket, articles);
        await insertReglementTicketBdd(connection, idTicket, reglements);
        await connection.promise().commit();   
    }
    catch(err){
        if(connection)
            await connection.promise().rollback();
        throw err;
    }
    finally{
        endConnection(connection);
    }
}

async function insertTicketBdd(connection, ticket){
    delete ticket.idticket;
    delete ticket.reglements;
    delete ticket.articles;
    const {query, values} = getSqlInsert(TABLE_TICKET, [ticket], true);
    const [result] = await connection.promise().query(query, [values], true);
    return result.insertId;
}


async function insertArticleTicketBdd(connection, idticket, articles){
    if(!articles.length)
        return;
    for(const article of articles){
        delete article.idarticleticket;
        article.idticket = idticket;
    }
    const {query, values} = getSqlInsert(TABLE_ARTICLE, articles, true);
    await connection.promise().query(query, [values], true);
}

async function insertReglementTicketBdd(connection, idticket, reglements){
    if(!reglements.length)
        return;
    for(const reglement of reglements){
        delete reglement.idreglement;
        reglement.idticket = idticket;
    }
    const {query, values} = getSqlInsert(TABLE_REGLEMENT, reglements, true);
    await connection.promise().query(query, [values], true);
}

module.exports = {
    chargerTicketMagasin,
    chargerTicketMagasinByNoCaisse
}