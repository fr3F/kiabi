const { verifierFichierBool } = require("../../helpers/file.helper");
const { isDate } = require("../../helpers/form.helper");
const { formatDate, dataToJson, ecrireFichier, formaterNb } = require("../../helpers/helpers.helper");
const db = require("../../models");
const sequelize = db.sequelize;

const Ticket = db.ticket;
const Magasin = db.magasin;

const fs = require("fs");
const excelJS = require("exceljs"); // Pour l'export excel
const { getDetailTicketJourMagasin } = require("./transfert-sage.service");
const { alignColumnAndAddBorder, setHeaderResponseAttachementExcel } = require("../../helpers/excel.helper");
const { selectSql } = require("../../helpers/db.helper");
// const axios = require('axios');
const axios = require('./../../helpers/axios.helpers');
const { API_LAST_FACTURE } = require("../../config/environments/mysql/environment");
const { generateContentFacture } = require("./file-facture.service");



const COLONNES_EXCEL_TICKET = [
    {header: "Caisse", key: "nocaisse", width: 10},        
    {header: "Date", key: "datecreation", width: 16},        
    {header: "Caissier", key: "caissier", width: 30},        
    {header: "Numéro ticket", key: "numticket", width: 15},        
    {header: "Code", key: "code", width: 15},        
    {header: "Désignation", key: "designation", width: 40},        
    {header: "Gamme", key: "gamme", width: 15},        
    {header: "Quantité", key: "quantite", width: 12},        
    {header: "Prix", key: "prixdevente", width: 15},        
    {header: "Remise %", key: "remise", width: 15},        
    {header: "TVA", key: "tauxtva", width: 7},        
    {header: "Total", key: "prixtotal", width: 15},        

]


async function getTicketsAExporter(date){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const tickets = await Ticket.findAll({
        where: sequelize.where(sequelize.fn('date', sequelize.col('datecreation')), sequelize.fn('date', date)),
        order: [["codeclient", "ASC"], ["magasin", "ASC"]],
        include: ["encaissement", "articles"]
    })
    // if(!tickets.length)
    //     throw new Error("Aucun ticket trouvé");
    return dataToJson(tickets);
}

async function getAllMagasins(){
    const magasins = dataToJson(await Magasin.findAll());
    for(const magasin of magasins){
        const apiUrl = API_LAST_FACTURE + magasin.souche;
        const response = await axios.get(apiUrl);
        magasin.lastnumfact = response.data.lastnum;
        // if(magasin.lastnumfact){
        //     const code = magasin.code?? "";
        //     const lastNumFacture = parseInt(magasin.lastnumfact.replace(code, "")) - 1;
        //     const lastNumFactureStr = lastNumFacture + "";
        //     magasin.lastnumfact = code + (lastNumFactureStr.padStart(8-code.length, "0"));
        // }
    }
    return magasins;
}



async function getContentExport(date){
    const magasins = await getAllMagasins();
    const tickets = await getTicketsAExporter(date);
    const rep = [];
    let magasin = undefined;
    let codeclient = undefined;
    let numeroFacture = undefined;
    for(let ticket of tickets){
        if(magasin != ticket.magasin || codeclient != ticket.codeclient){
            magasin = ticket.magasin;
            codeclient = ticket.codeclient;
            numeroFacture = getNumeroFacture(ticket, magasins);
        }
        if(!ticket.numeroFacture)
            ticket.numeroFacture = numeroFacture;
        rep.push(generateLinesTicket(ticket));
    }
    return {contenu: rep.join("\r\n"), magasins, tickets};
}

    

async function getDataExportSql(date){
    date = formatDate(date, "YYYY-MM-DD")
    const sql = `SELECT distinct numeroFacture, t.magasin, souche
                    FROM ticket t 
                        JOIN magasin m ON(m.nommagasin = t.magasin)
                        JOIN encaissement e ON(e.idencaissement = t.idencaissement)
                    WHERE DATE(e.createdAt) = DATE('${date}')`;
    return await selectSql(sql);
}

async function getContentExportSql(date){
    const data = await getDataExportSql(date);
    const tab = [];
    for(const item of data){
        tab.push(`UPDATE F_DOCENTETE SET DO_Souche=${item.souche} WHERE DO_Piece='=${item.numeroFacture}';`)
    }
    return tab.join("\n");
}

function getNumeroFacture(ticket, magasins){
    if(ticket.numeroFacture)
        return ticket.numeroFacture;
    const magasin = magasins.find((r)=> r.nommagasin == ticket.magasin);
    if(!magasin)
        throw new Error("Magasin introuvable pour le ticket " + ticket.numticket);
    if(!magasin.lastnumfact)
        throw new Error("Le magasin n'a pas encore de numéro de la dernière facture");
    let lastNumFacture = 0;
    let code = magasin.code? magasin.code: "";  
    if(magasin.lastnumfact)    {
        lastNumFacture = parseInt(magasin.lastnumfact.replace(code, ""));
    }
    lastNumFacture ++;
    const lastNumFactureStr = lastNumFacture + "";
    ticket.numeroFacture = code + (lastNumFactureStr.padStart(8-code.length, "0"));
    magasin.lastnumfact = ticket.numeroFacture ;
    return ticket.numeroFacture;
}



function generateLinesTicket(ticket){
    let rep = [];
    const date = formatDate(ticket.datecreation, 'DDMMYY');
    for(let article of ticket.articles){
        const line = generateLineArticle(article, ticket.numeroFacture, date, ticket.codeclient, ticket.depot)
        rep.push(line);
    }
    return rep.join("\r\n");
}


function generateLineArticle(article, numeroFacture, date, codeclient, depot){
    const remise = article.montantremise * 100 /article.prixtotal;
    article.prixunitaire = article.prixdevente * 100 / (100 + article.tauxtva)
    let rep = ["0", "6", numeroFacture, date, codeclient, article.code,
        article.designation, article.gamme??"", article.numerodeserie?? "",
        formaterNb(article.prixunitaire), formaterNb(article.quantite),
        formaterNb(remise), formaterNb(article.tauxtva),  depot
    ]         
    return rep.join(";")
}

// async function exporterFichierSage(date, res){
//     const filename = `facture-${formatDate(new Date(date), "YYYYMMDD")}.txt`;
//     let path = `${__basedir}/public/sage/${filename}`; 
//     const {contenu, magasins, tickets} = await getContentExport(date); 
//     // await sequelize.transaction(async(transaction)=>{
//     //     await generateContentFacture(date, transaction);    
//     // })
//     ecrireFichier(path, contenu, "latin1");
//     while(!verifierFichierBool(path)){
//     }
//     await updateTicketAndMagasin(tickets, magasins);
//     if(!res)
//         return {path, filename};
//     let stream = fs.createReadStream(path);               
//     res.setHeader(
//         "Content-Disposition",
//         "attachment; filename=" + filename + ";"
//     );
//     stream.on('open', function () {
//         stream.pipe(res);
//     })
// }


async function exporterFichierSage(date, idParametrage, res){
    const filename = `facture-${formatDate(new Date(date), "YYYYMMDD")}.txt`;
    let path = `${__basedir}/public/sage/${filename}`; 
    let contenu;
    await sequelize.transaction(async (transaction) => {
        contenu = await generateContentFacture(date, idParametrage, transaction); 
        ecrireFichier(path, contenu, "latin1");
    });
    while(!verifierFichierBool(path)){
    }
    if(!res)
        return {path, filename};
    let stream = fs.createReadStream(path);               
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename + ";"
    );
    stream.on('open', function () {
        stream.pipe(res);
    })
}

async function exporterFichierSql(date, res){
    const filename = `facture-${formatDate(new Date(date), "YYYYMMDD")}.sql`;
    let path = `${__basedir}/public/sql/${filename}`; 
    const contenu = await getContentExportSql(date); 
    ecrireFichier(path, contenu, "latin1");
    while(!verifierFichierBool(path)){
    }
    if(!res)
        return {path, filename};
    let stream = fs.createReadStream(path);               
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename + ";"
    );
    stream.on('open', function () {
        stream.pipe(res);
    })
}


async function updateTicketAndMagasin(tickets, magasins){
    await sequelize.transaction(async (transaction)=>{
        await Magasin.bulkCreate(magasins, {transaction, updateOnDuplicate: ["lastnumfact"]});
        await Ticket.bulkCreate(tickets, {transaction, updateOnDuplicate: ["numeroFacture"]});
    })
}


// exporter excel ticket
async function exporterExcelTicket(date, magasin, client, res){
    const itemTickets = await getDetailTicketJourMagasin(date, magasin, client);
    formatItemTicketExport(itemTickets);
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tickets"); // New Worksheet
    worksheet.columns = COLONNES_EXCEL_TICKET;
    itemTickets.forEach((item)=>{
        if(!item.gamme)
            item.gamme = "";
        item.remise = isNaN(item.remise)?"": item.remise;
        worksheet.addRow(item);
    })
    worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
    alignColumnAndAddBorder(worksheet)
    setHeaderResponseAttachementExcel(res, `Tickets-${formatDate(new Date(date), 'DD-MM-YYYY')}-${magasin}.xlsx`);
    workbook.xlsx.writeBuffer({useStyles: true}).then((r)=>{
        res.send(r)
    }) 
}

function formatItemTicketExport(itemTickets){
    for(const itemTicket of itemTickets){
        itemTicket.nocaisse = itemTicket.ticket.nocaisse;
        itemTicket.datecreation = formatDate(new Date(itemTicket.ticket.datecreation), 'DD/MM/YYYY HH:mm');
        itemTicket.caissier = `${itemTicket.ticket.encaissement.caissier.nom} ${itemTicket.ticket.encaissement.caissier.prenom}`;
        itemTicket.numticket = itemTicket.ticket.numticket;
    }
}


module.exports = {
    exporterFichierSage,
    exporterExcelTicket,
    exporterFichierSql
}