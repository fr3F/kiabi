const { Op } = require("sequelize");
const { formatDate, verifierExistence, getValeurAttribut, ecrireFichier } = require("../../helpers/helpers.helper");
const db = require("../../models");
const { setNumeroFactureTickets, insertDataFacture, getContentDataFactures2, setLastnumfactMagasin } = require("./file-facture.service");
const { verifierFichierBool } = require("../../helpers/file.helper");
const { urlLogo } = require("../../config/environments/mysql/environment");
const { sendEmail } = require("../../config/environments/mysql/email.config");
const { getConfigurationDbCaisse, endConnection } = require("../caisse/util.service");

const mysql2 = require('mysql2');
let Handlebars = require("handlebars");

const fs = require("fs");
const { TYPE_DESTINATAIRE } = require("../util/util");

const sequelize = db.sequelize;

const Ticket = db.Ticket;
const Caisse = db.Caisse;
const Magasin = db.Magasin;

// Ajouter çà pour config __basedir
import * as path from 'path';
const __basedir = path.resolve();


async function generateContentFactureDepot(idticket, codemagasin, nocaisse, transaction){
    const magasin = await verifierExistence(Magasin, codemagasin, "Magasin", [], transaction, "code");
    await setLastnumfactMagasin(magasin, true);
    const {dbConfig, caisse} = await getCaisseDbConfig(nocaisse, magasin.id);
    let connection = null;
    try{
        connection = mysql2.createConnection(dbConfig);
        await connection.promise().beginTransaction();

        const {content, ticket} = await processFacture(idticket, magasin, connection, transaction);
        
        await connection.promise().commit();   
        return {content, ticket, caisse, magasin};
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

async function processFacture(idticket, magasin, connection, transaction) {
    try {
        const { ticket } = await updateNumeroFacture(idticket, magasin, connection, transaction);
        ticket.articles = await getArticleTickets(ticket.idticket, connection);
        ticket.magasinObj = magasin;
        const cumps = await getCumpsTicket(ticket);
        await insertDataFactureDepot(ticket, cumps, transaction);
        const content = await getContentDataFactures2(transaction);

        return {content, ticket};
    } catch (error) {
        // Gérer les erreurs ici si nécessaire
        throw error; // Facultatif : relancer l'erreur pour la gestion ultérieure
    }
}


async function updateNumeroFacture(idticket, magasin, connectionCaisse, transaction){
    const sqlTicket = `SELECT * FROM ticket WHERE idticket = '${idticket}'`;
    const rep = await selectDbCaisse(connectionCaisse, sqlTicket);
    if(!rep.length)
        throw new Error("Ticket introuvable");
    setNumeroFactureTickets(rep, [magasin]);
    await Magasin.update({lastnumfact: magasin.lastnumfact}, {where: {id: magasin.id}, transaction});
    await updateNumeroFactureCaisse(rep[0], connectionCaisse);
    return {ticket: rep[0], magasin};
}


async function selectDbCaisse(connection, sql){
    const rep = await connection.promise().query(sql);
    return rep[0];
}

async function getCaisseDbConfig(nocaisse, idMagasin){
    const caisse = await Caisse.findOne({where: {nocaisse, idMagasin}});
    if(!caisse)
        throw new Error("Caisse introuvable");
    const dbConfig = getConfigurationDbCaisse(caisse);
    return {dbConfig, caisse};
}

async function updateNumeroFactureCaisse(ticket, connection){
    const sql = `UPDATE ticket SET numeroFacture = '${ticket.numeroFacture}' WHERE idticket = '${ticket.idticket}'`;
    await connection.promise().query(sql);
}

async function getArticleTickets(idticket, connection){
    const sql = `SELECT * FROM articleticket WHERE idticket = '${idticket}' and quantite != 0 ORDER BY quantite ASC`;
    return await selectDbCaisse(connection, sql);
}

async function getCumpsTicket(ticket){
    const codes = getValeurAttribut("code", ticket.articles);
    return await db.cump.findAll({where: {code: {[Op.in]: codes}}});
}

async function insertDataFactureDepot(ticket, cumps, transaction){
    const facture = {items: [ticket], numeroFacture: ticket.numeroFacture};
    const dateSage = formatDate(new Date(ticket.datecreation), "DDMMYY");
    await insertDataFacture(facture, dateSage, cumps, transaction);
}


async function exporterFichierSageDepot(idticket, codemagasin, nocaisse){
    let path;
    let filename;
    let data = {};
    await sequelize.transaction(async (transaction) => {    
        data = await generateContentFactureDepot(idticket, codemagasin, nocaisse, transaction); 
        const {ticket, content} = data;
        filename = `facture-${ticket.numeroFacture}.txt`;
        path = `${__basedir}/public/sage/${filename}`; 
        ecrireFichier(path, content, "latin1");
    });
    while(!verifierFichierBool(path)){
    }
    return {path, filename, ticket: data.ticket, caisse: data.caisse, magasin: data.magasin};
}

function verifierMail(idticket, nocaisse){
    if((!idticket))
        throw new Error("Veuillez renseigner l'identifiant du ticket");
    if((!nocaisse))
        throw new Error("Veuillez renseigner le numéro caisse");
}

async function envoyerMailSageVenteDepot(idticket, codemagasin, nocaisse){
    verifierMail(idticket, nocaisse);
    const fileSage = await exporterFichierSageDepot(idticket, codemagasin, nocaisse);
    const subject = "Fichier à transférer vers SAGE (Vente dépôt) - " + (fileSage.ticket? fileSage.ticket.numeroFacture: '');
    const pathTemplate = __basedir + "/app/templates/mail/transfert-sage-depot.html";
    const source =  fs.readFileSync(pathTemplate, "utf8");
    const template = Handlebars.compile(source);
    const  htmlContent = template({urlLogo});
    // const destinataires = ["dev01@sodim.mg"];
    const destinataires = await getDestinataires();
    let attachments = getAttachements(fileSage)
    await sendEmail(destinataires, subject, htmlContent, attachments);
    return fileSage;

}

function getAttachements(fileSage){
    return [
        {
            filename: fileSage.filename,
            path: fileSage.path
        },
      
    ]
}

async function getDestinataires(){
    let rep = await db.destinataireMail.findAll(
        {where: {type: TYPE_DESTINATAIRE.normal}}
    );
    return getValeurAttribut("email", rep);
}

async function autoriserVenteDepot(codemagasin){
    const magasin = await verifierExistence(Magasin, codemagasin, "Magasin", [], null, "code");
    try{
        await setLastnumfactMagasin(magasin, true);
        magasin.lastnumfacture = "";
    }
    catch(err){

    }
    return magasin.lastnumfacture;
}

// Regulariser facture vente depot en cas d'erreur
async function regulariserFactureVenteDepot(idticket, codemagasin, nocaisse){
    const data = await envoyerMailSageVenteDepot(idticket, codemagasin, nocaisse);
    const ticket = await Ticket.findOne({where: {
        numticket: data.ticket.numticket,
        nocaisse: nocaisse,
        magasin: data.magasin.nommagasin
    }});
    if(ticket)
        await Ticket.update({numeroFacture: data.ticket.numeroFacture}, {where: {idticket: ticket.idticket}});    
    return {numeroFacture: data.ticket.numeroFacture};
}



module.exports = {
    envoyerMailSageVenteDepot,
    autoriserVenteDepot,
    regulariserFactureVenteDepot
}