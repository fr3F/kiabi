const { isDate } = require("../../helpers/form.helper");
const { formatDate } = require("../../helpers/helpers.helper");
const { calculPrixArticle } = require("../reporting/reporting.service");

const { getCaisseSync, pingCaisse, endConnection } = require("./util.service");

const mysql2 = require('mysql2');
const excelJS = require("exceljs"); // Pour l'export excel
const { alignColumnAndAddBorder, setHeaderResponseAttachementExcel } = require("../../helpers/excel.helper");
const { ErrorCode } = require("../../helpers/error");

async function getArticleTicketsCaisse(id, debut, fin, code, client){
    verifierDate(debut, fin);
    const {caisse, destDBConfig} = await getCaisseSync(id)

    console.log("caisse", caisse);
    console.log("destDBConfig", destDBConfig);
    
    const ping = await pingCaisse(caisse);  // Tester si la caisse est pingable

    console.log("ping", ping);
    
    if(!ping)
        throw new ErrorCode("Impossible de se connecter à la caisse", 503);
    if(!client)
        return await getTicketsBddCaisse(destDBConfig, debut, fin, code);
    return await getArticleTicketsBddCaisseClient(destDBConfig, debut, fin, code, client);
}

function verifierDate(debut, fin){
    if(!isDate(debut) || !isDate(fin))
        throw new Error("Veuillez renseigner des dates valides");
    if(new Date(debut) > new Date(fin))
        throw new Error("La date de début doit être avant la date de fin"); 
}

async function getTicketsBddCaisse(destDBConfig, debut, fin, code){
    const sql = getSqlTickets(debut, fin, code);
    let connection = null;
    try{
            connection = mysql2.createConnection(destDBConfig);
            await connection.promise().connect();
            const res = await connection.promise().query(sql);
            const tickets = res[0];
            calculPrixArticle(tickets);
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


function getSqlTickets(debut, fin, code){
    debut = formatDate(debut, "YYYY-MM-DD");
    fin = formatDate(fin, "YYYY-MM-DD");
    let sql = `SELECT t.*, 
                    a.code, a.designation, a.gamme, a.quantite, a.montantremise,
                    a.tauxtva, a.prixdevente, a.prixtotal, depot
                FROM ticket t 
                    JOIN articleticket a ON(a.idticket = t.idticket)
                WHERE DATE(datecreation) >= DATE('${debut}') 
                        AND DATE(datecreation) <= DATE('${fin}')
               `;
    if(code)
        sql = sql + ` AND code = ${mysql2.escape(code)}`
    return sql + "  ORDER BY datecreation DESC";
}


const COLONNES_EXCEL_ARTICLE = [
    // {header: "Facture", key: "numeroFacture", width: 12},        
    {header: "N° Ticket", key: "numticket", width: 13},        
    {header: "Date", key: "date", width: 11},        
    {header: "Heure", key: "heure", width: 10},        
    {header: "Client", key: "codeclient", width: 12},        
    {header: "Code Art", key: "code", width: 12},        
    {header: "Désignation", key: "designation", width: 40},        
    {header: "Variant", key: "gamme", width: 15},        
    {header: "Qté", key: "quantite", width: 12},        
    {header: "PuHT", key: "puHT", width: 15},        
    {header: "Remise %", key: "remise", width: 15},        
    {header: "TVA %", key: "tauxtva", width: 15},        
    {header: "Magasin", key: "magasin", width: 20},        
    {header: "Dépôt", key: "depot", width: 25},        
    {header: "PxTotal HT", key: "prixTotalHT", width: 15},        
    {header: "PxTotal TTC", key: "prixTotalTTC", width: 15},        

]


// exporter excel consultation caisses
async function exporterExcelVentesCaisses(id, {debut, fin, code, client}, res){
    const articleTickets = await getArticleTicketsCaisse(id, debut, fin, code, client);
    if(!articleTickets.length)
        throw new Error("Aucune vente trouvée");
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
    itemTicket.date = formatDate(itemTicket.datecreation, 'DD-MM-YYYY');
    itemTicket.heure = formatDate(itemTicket.datecreation, 'HH:mm:ss');
    if(!itemTicket.gamme)
        itemTicket.gamme = "";
    itemTicket.numeroFacture = itemTicket.numeroFacture?? ""; 
}

function getSqlNumTicketsClient(debut, fin, client){
   const sql = `SELECT t.numticket
                FROM ticket t 
                    JOIN articleticket a ON(a.idticket = t.idticket)
                WHERE DATE(datecreation) >= DATE('${debut}') 
                        AND DATE(datecreation) <= DATE('${fin}')
                        AND a.designation LIKE ${client}
                        AND COALESCE(a.code, '') = ''`;
    return sql;
}

// Fonction utilisée pour le filtre par client des articles tickets
async function getArticleTicketsBddCaisseClient(destDBConfig, debut, fin, code, client){
    debut = formatDate(debut, "YYYY-MM-DD");
    fin = formatDate(fin, "YYYY-MM-DD"); 
    client = mysql2.escape(`%${client.toString().trim()}%`);
    let connection = null;
    try{
            connection = mysql2.createConnection(destDBConfig);
            await connection.promise().connect();
            const numtickets = await getNumTicketsClient(connection, debut, fin, client);
            const tickets = await  getArticleTicketsClient(connection, debut, fin, client, numtickets);
            calculPrixArticle(tickets);
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

async function getNumTicketsClient(connection, debut, fin, client){
    const sql = getSqlNumTicketsClient(debut, fin, client);
    const res = await connection.promise().query(sql);
    return res[0].map((r)=> `'${r.numticket}'`);
}

function getSqlArticleTicketsClient(debut, fin, client, numtickets){
    const numticket = numtickets.join(", ");
    const sql = `SELECT t.*, 
                    a.code, a.designation, a.gamme, a.quantite, a.montantremise,
                    a.tauxtva, a.prixdevente, a.prixtotal, depot
                FROM ticket t 
                    JOIN articleticket a ON(a.idticket = t.idticket)
                WHERE DATE(datecreation) >= DATE('${debut}') 
                        AND DATE(datecreation) <= DATE('${fin}')
                        AND t.numticket IN (${numticket}) AND a.designation NOT LIKE ${client} AND COALESCE(a.code, '') != '' 
                ORDER BY datecreation DESC`;
    return sql;
}

async function getArticleTicketsClient(connection, debut, fin, client, numtickets){
    if(!numtickets.length)
        return [];
    const sql = getSqlArticleTicketsClient(debut, fin, client, numtickets);
    const res = await connection.promise().query(sql);
    return res[0];
}

module.exports = {
    getArticleTicketsCaisse,
    exporterExcelVentesCaisses
}