const { formatDate } = require("../../../helpers/helpers.helper");
const { loggerGlobal } = require("../../../helpers/logger");
const { sendFileToFtp } = require("../../data-transfert/services/upload.service");
const { KIABI_SEPARATOR, KIABI_TAG, KIABI_EXTENSION } = require("../../data-transfert/utils/constant");
const { findAndVerifyMagasin, getAllMagasins } = require("../../others/magasin/services/magasin.service");
const { SALES_LINE_LEVEL, MAX_DECIMAL_NUMBER, SALES_FILE_PREFIX } = require("../utils/constant");
const { getTicketsByMagasin, verifierDonneeCaisseVenteVide } = require("./sales.service")


async function sendSalesToFtp(date) {
    const magasins = await getAllMagasins();
    for(const magasin of magasins){
        await sendSalesMagasinToFtp(magasin.id, date);
    }
}

async function sendSalesMagasinToFtp(idMagasin, date) {
    const tickets = await getTicketsByMagasin(idMagasin, date, true);
    const isEmpty = verifierDonneeCaisseVenteVide(tickets, idMagasin, date) 
    if(isEmpty)return[];
    const magasin = await findAndVerifyMagasin(idMagasin);
    const fileContent = generateFileContent(tickets);
    const filename = generateFilename(magasin, date);
    await sendFileToFtp(fileContent, filename);
}

function generateFileContent(tickets) {
    let lines = [KIABI_TAG.open];
    for(const ticket of tickets){
        lines = lines.concat(generateTicketContent(ticket));
    }
    lines.push(KIABI_TAG.close);
    return lines.join(KIABI_SEPARATOR.line);
}

function generateFilename(magasin, date){
    const formatedDate = formatDate(date, "YYMMDD")
    return `${SALES_FILE_PREFIX}_${magasin.storeCode}_${formatedDate}${KIABI_EXTENSION}`
}

function generateTicketContent(ticket){
    fixArticlesTicket(ticket);
    fixReglements(ticket);
    const header = generateTicketHeader(ticket);
    const lines = generateTicketLines(ticket);
    const loyalty = generateLoyaltyLine(ticket.loyalty);
    const reglements = generateReglementLines(ticket.reglements);
    return [
        header,
        ...lines,
        loyalty,
        ...reglements
    ]
}

function fixArticlesTicket(ticket){
    ticket.articles = ticket.articles.filter((r)=> r.codeean);
}

function fixReglements(ticket){
    const sellingPrice = sumSellingPrice(ticket);
    const reglementAmount = sumReglement(ticket);
    const diff = sellingPrice - reglementAmount;
    ticket.reglements[0].amount += diff;
}

function sumSellingPrice(ticket){
    let total = 0;
    for(const article of ticket.articles)
        total += article.prixdevente * article.quantite;
    return total;
}

function sumReglement(ticket){
    let total = 0;
    for(const reglement of ticket.reglements)
        total += reglement.amount;
    return total;
}

function generateTicketHeader(ticket){
    const transactionDate = formatDate(ticket.datecreation, "YYYY-MM-DDTHH:mm:ssZ");
    const numTicket = ticket.numticket.replace("#", "")
    const resp = [
        SALES_LINE_LEVEL.header,
        ticket.nocaisse,
        numTicket,
        formatNumber(ticket.montantremise),
        "",
        transactionDate
    ];
    return resp.join(KIABI_SEPARATOR.column);
}

function generateTicketLines(ticket){
    const lines = [];
    for(const article of ticket.articles){
        lines.push(generateTicketLine(article));
    }
    return lines;
}

function generateTicketLine(article){
    const prixUnitaire = getPrixUnitaireRemise(article);
    const resp = [
        SALES_LINE_LEVEL.data,
        article.codeean,
        article.quantite,
        article.returnReason,
        formatNumber(prixUnitaire),
        formatTva(article.tauxtva),
        article.origTransactionType,
        ""
    ];
    return resp.join(KIABI_SEPARATOR.column);
}

function getPrixUnitaireRemise(article){
    if(!article.montantremise)
        return article.prixdevente;
    return article.prixdevente - (article.montantremise / article.quantite);
}

function generateLoyaltyLine(loyalty){
    loyalty = loyalty?? {};
    const resp = [
        SALES_LINE_LEVEL.loyalty,
        getValueNotNull(loyalty.loyaltyCardNumber),
        getValueNotNull(loyalty.scoredPoints),
        getValueNotNull(loyalty.fidelityDiscount),
    ];
    return resp.join(KIABI_SEPARATOR.column);
}

function generateReglementLines(reglements){
    const lines = [];
    for(const reglement of reglements){
        lines.push(generateReglementLine(reglement));
    }
    return lines;
}

function generateReglementLine(reglement){
    const resp = [
        SALES_LINE_LEVEL.reglement,
        reglement.financingType,
        reglement.currency,
        formatNumber(reglement.amount),
        reglement.financingId
    ];
    return resp.join(KIABI_SEPARATOR.column);
}

function formatNumber(nb){
    return parseFloat(nb).toFixed(MAX_DECIMAL_NUMBER).replace(/\.?0+$/, '');
}

function formatTva(tva){
    return tva.toFixed(2);
}

function getValueNotNull(value, defaultValue = ''){
    return value?? defaultValue;
}

module.exports = {
    sendSalesMagasinToFtp,
    sendSalesToFtp
}