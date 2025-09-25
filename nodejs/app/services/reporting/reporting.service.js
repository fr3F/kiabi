const { escape } = require("mysql2");
const helper = require("../../helpers/helpers.helper");
const db = require("../../models");
const { selectSql } = require("../../helpers/db.helper");
const { Op, fn, col, literal } = require("sequelize");
const sequelize = db.sequelize;

const Magasin = db.magasin;
const ArticleTicket = db.articleTicket;
const Ticket = db.ticket;

const fs = require("fs");
const excelJS = require("exceljs"); // Pour l'export excel
const { alignColumnAndAddBorder, setHeaderResponseAttachementExcel } = require("../../helpers/excel.helper");



const COLONNES_EXCEL_ARTICLE = [
    {header: "Facture", key: "numeroFacture", width: 12},        
    {header: "N° caisse", key: "nocaisse", width: 10},        
    {header: "N° Ticket", key: "numeroTicket", width: 13},        
    {header: "Date", key: "date", width: 11},        
    {header: "Heure", key: "heure", width: 10},        
    {header: "Client", key: "codeclient", width: 12},        
    {header: "Code Art", key: "code", width: 12},        
    {header: "Code EAN", key: "codeean", width: 15},        
    {header: "Désignation", key: "designation", width: 40},        
    {header: "Variant", key: "gamme", width: 15},        
    {header: "Qté", key: "quantite", width: 12},        
    {header: "PuHT", key: "puHT", width: 15},        
    {header: "Remise %", key: "remise", width: 15},        
    {header: "TVA %", key: "tauxtva", width: 15},        
    {header: "Magasin", key: "magasin", width: 20},        
    {header: "Dépôt", key: "depot", width: 25},        
    {header: "Carte VIP", key: "clientvip", width: 18},        
    {header: "PxTotal HT", key: "prixTotalHT", width: 15},        
    {header: "PxTotal TTC", key: "prixTotalTTC", width: 15},        

]

async function searchClient(search){
    if(!search || !search.trim())
        return [];
    search = escape(`%${search.trim()}%`);
    const sql = `SELECT code FROM client WHERE code LIKE ${search} LIMIT 20`;
    const rep = await selectSql(sql);
    return helper.getValeurAttribut("code", rep);
}

// Reporting articles tickets
async function getReportings({dateDebut, dateFin, codeclient, idMagasin}){
    if(!dateDebut || !dateFin)
        return [];
    const where = await getConditionSearch(dateDebut, dateFin, codeclient, idMagasin);
    const order = [[{model: Ticket, as: "ticket"}, "magasin"], [{model: Ticket, as: "ticket"}, "nocaisse", "ASC"], [{model: Ticket, as: "ticket"}, "numeroFacture", "ASC"]];
    let rep = await ArticleTicket.findAll({where, order, include: ["ticket"]});
    rep = helper.dataToJson(rep);
    calculPrixArticle(rep);
    return rep; 
}

function calculPrixArticle(articles){
    for(const article of articles){
        article.puHT = article.prixdevente * 100 / (100 + parseFloat(article.tauxtva)); 
        article.remise = 100 * article.montantremise / article.prixtotal;   
        article.remise = !isNaN(article.remise) ? article.remise: 0; 
        article.prixTotalHT = article.quantite * (article.puHT * (1-article.remise/100));
        article.prixTotalTTC = article.prixTotalHT * (1 + article.tauxtva / 100); 
    }
}

async function getConditionSearch(dateDebut, dateFin, codeclient, idMagasin){
    const rep = {
        [Op.and]: [
            literal(`date(ticket.datecreation) >= date('${helper.formatDate(new Date(dateDebut), 'YYYY-MM-DD')}')`),
            literal(`date(ticket.datecreation) <= date('${helper.formatDate(new Date(dateFin), 'YYYY-MM-DD')}')`)  
        ],
        code: {[Op.not]: null}
    }
    if(codeclient && codeclient.trim())
        rep["$ticket.codeclient$"] = {[Op.like]: `%${codeclient.trim()}%`};
    if(idMagasin){
        const magasin = await helper.verifierExistence(Magasin, idMagasin, "Magasin");
        rep["$ticket.magasin$"] = magasin.nommagasin;
    }
    return rep;
} 


// exporter excel reporting ticket
async function exporterExcelReportingTicket({dateDebut, dateFin, codeclient, idMagasin}, res){
    const articleTickets = await getReportings({dateDebut, dateFin, codeclient, idMagasin});
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Articles"); // New Worksheet
    worksheet.columns = COLONNES_EXCEL_ARTICLE;
    articleTickets.forEach((item)=>{
        formatItemTicketExport(item);
        worksheet.addRow(item);
    })
    worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
    alignColumnAndAddBorder(worksheet)
    setHeaderResponseAttachementExcel(res, `Reporting.xlsx`);
    workbook.xlsx.writeBuffer({useStyles: true}).then((r)=>{
        res.send(r)
    }) 
}

function formatItemTicketExport(itemTicket){
    itemTicket.numeroFacture = itemTicket.ticket.numeroFacture;
    itemTicket.nocaisse = itemTicket.ticket.nocaisse;
    itemTicket.numeroTicket = itemTicket.ticket.numticket;
    itemTicket.clientvip = itemTicket.ticket.clientvip?? "";
    itemTicket.codeclient = itemTicket.ticket.codeclient;
    itemTicket.magasin = itemTicket.ticket.magasin;
    itemTicket.depot = itemTicket.ticket.depot;
    itemTicket.date = helper.formatDate(itemTicket.ticket.datecreation, 'DD-MM-YYYY');
    itemTicket.heure = helper.formatDate(itemTicket.ticket.datecreation, 'HH:mm:ss');
    if(!itemTicket.gamme)
        itemTicket.gamme = "";
    itemTicket.numeroFacture = itemTicket.numeroFacture?? ""; 
}
module.exports = {
    searchClient,
    getReportings,
    exporterExcelReportingTicket,
    calculPrixArticle,
}
