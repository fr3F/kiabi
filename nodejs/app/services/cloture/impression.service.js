
const pdf = require("html-pdf");
let fs = require("fs");
let Handlebars = require("handlebars");
const { formatDate, formatEntier, verifierExistence, dataToJson } = require("../../helpers/helpers.helper");
const { zoomPdf, urlBackLocal, DEVISE} = require("../../config/environments/mysql/environment");
const { OPTION_PDF_PORTRAIT, setHeaderResponseAttachementPdf } = require("../../helpers/pdf-helper");
const db = require("../../models");
const { selectSql } = require("../../helpers/db.helper");

const Encaissement = db.Encaissement;

// Imprimer reglement
async function imprimerReglement(idencaissement, user, res){
    let {html, options, encaissement} = await getHtmlOptionPdfReglement(idencaissement, user);
    await pdf.create(html, options).toStream(async function (err, stream) {
        if (err) {
            res.status(500).send({message: "Il y a une erreur lors de l'impression en pdf"})
            return;
        }               
        let pdfName = `Reglement-${encaissement.magasin}-${encaissement.nocaisse}.pdf`;
        setHeaderResponseAttachementPdf(res, pdfName);
        stream.pipe(res);
    });
};

// Recuperer html pour le pdf, avec les options et l'encaissement
async function getHtmlOptionPdfReglement(idencaissement, user, transaction){
    const encaissement = await getEncaissement(idencaissement, transaction);
    encaissement.endAt = formatDate(encaissement.endAt, "DD-MM-YYYY à HH:mm")
    encaissement.createdAt2 = formatDate(encaissement.createdAt, "DD-MM-YYYY à HH:mm")
    const { reglements, total } = await getReglements(idencaissement, transaction);
    const totalTicket = await getTotalTicket(idencaissement, transaction);
    encaissement.total = formatEntier(total);
    encaissement.totalTicket = formatEntier(totalTicket);
    let {html, options} = await getOptionPdfReglement(encaissement, reglements, dataToJson(user)); 
    return {html, options, encaissement};
}

// Generer fichier reglement
async function generateReglementPdf(idencaissement, user, path, transaction){
    let {html, options, encaissement} = await getHtmlOptionPdfReglement(idencaissement, user, transaction);
    const date = replaceAll(encaissement.createdAt, "/", "-")
    let pdfName = `\\Reglement-${encaissement.magasin}(${encaissement.nocaisse})-${date}.pdf`;
    await pdf.create(html, options).toFile(path + pdfName, (err, res) => {
        if (err) return console.log(err);
        console.log(res); // Informations sur le fichier PDF créé
    });
};

function replaceAll(str, old, newValue){
    const regex = new RegExp(old, 'g');
    return str.replace(regex, newValue);
}


async function getEncaissement(idencaissement, transaction){
    return await verifierExistence(Encaissement, idencaissement, "Encaissement", ["caissier"], transaction, "idencaissement");
}

async function getReglements(idencaissement, transaction){
    const sql = `SELECT * 
                    FROM v_reglements_encaissement
                    WHERE idencaissement = ${idencaissement}
                    ORDER BY modepaiement, codeclient, numticket ASC`;
    const rep = await selectSql(sql, transaction);
    return regrouperReglements(rep);
}


async function getTotalTicket(idencaissement, transaction){
    const sql = `SELECT SUM(montanttotal) montanttotal 
                    FROM v_ticket_encaissement
                    WHERE idencaissement = ${idencaissement}
    `;
    const rep = await selectSql(sql, transaction);
    return rep[0].montanttotal;
}


function regrouperReglements(items){
    let rep = [];
    let indice = -1;
    let modepaiement = undefined;
    let total = 0;
    for(let item of items){
        if(item.modepaiement != modepaiement){
            modepaiement = item.modepaiement;
            indice ++;
            rep.push({modepaiement, items: [], total: 0, totalTicket: 0});
        }
        rep[indice].total += item.montantreglement;
        rep[indice].totalTicket += item.montanttotal;
        total += item.montantreglement;
        rep[indice].items.push(item);
    }
    formatTotal(rep)
    return {total, reglements: rep};
}

function regrouperParClient(items){
    let rep = [];
    let indice = -1;
    let codeclient = undefined;
    for(let item of items){
        if(item.codeclient != codeclient){
            codeclient = item.codeclient;
            indice ++;
            rep.push({codeclient, items: [], total: 0, totalTicket: 0});
        }
        rep[indice].total += item.montantreglement;
        rep[indice].totalTicket += item.montanttotal;
        formaterReglement(item);
        rep[indice].items.push(item);
    }
    formatTotal(rep, false)
    return rep;

}

function formaterReglement(item){
    item.montantreglement = formatEntier(item.montantreglement)
    item.montantpaiement = formatEntier(item.montantpaiement)
    item.montanttotal = formatEntier(item.montanttotal)
    item.recu = formatEntier(item.recu)
    item.arendre = formatEntier(item.arendre)

}

function formatTotal(items, groupClient = true){
    for(let item of items){
        item.total = formatEntier(item.total);
        item.totalTicket = formatEntier(item.totalTicket);
        if(groupClient)
            item.items = regrouperParClient(item.items)
    }
}
// Les options pour generer pdf
async function getOptionPdfReglement(encaissement, reglements, user){
    let source = await fs.readFileSync(__basedir + "/app/templates/pdf/reglements-pdf.html", "utf8");
    let template = await Handlebars.compile(source);
    encaissement.createdAt = formatDate(encaissement.createdAt, "DD/MM/YYYY");
    let date =  formatDate(new Date(), "DD/MM/YYYY à HH:mm");
    let html = await template({encaissement, reglements, urlBackLocal, zoomPdf, user, date, DEVISE});
    let options = OPTION_PDF_PORTRAIT;
    return {html, options};
}


module.exports = {
 imprimerReglement,
 generateReglementPdf
}