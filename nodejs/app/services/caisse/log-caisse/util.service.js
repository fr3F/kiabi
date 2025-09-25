const { Op } = require("sequelize");
const { isDate } = require("../../../helpers/form.helper");
const { formatDate, verifierExistence } = require("../../../helpers/helpers.helper");
const { magasin: Magasin, sequelize } = require("../../../models");
const ExcelJS = require('exceljs');
const { alignColumnAndAddBorder } = require("../../../helpers/excel.helper");

const LOG_MESSAGE = {
    suppressionLigne: "Suppression ligne",
    annulationTicket: "Annulation ticket"
}

const COLONNES_EXCEL_ARTICLE = [
    { header: 'Code', key: 'code', width: 15 },
    { header: 'Désignation', key: 'designation', width: 60 },
    { header: 'Gamme', key: 'gamme', width: 20 },
    { header: 'Quantité', key: 'quantite', width: 20 },
    { header: 'Caisse', key: 'nocaisse', width: 20 },
];

async function findMagasinAndVerifyDate(idMagasin, date) {
    verifyDate(date);
    return await findAndVerifyMagasin(idMagasin)
}

function verifyDate(date){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date");
    return formatDate(date, "YYYY-MM-DD");
}

async function findAndVerifyMagasin(idMagasin) {
    const magasin = await verifierExistence(Magasin, idMagasin, "Magasin");
    return magasin;
}

function getConditionCombined(magasin, date, message){
    return {
        [Op.and]: [
            { message },
            getConditionMagasin(magasin),
            getConditionDate(date)
        ]
    }
}

function getConditionMagasin(magasin){
    return {
        meta: {
            [Op.or]: [
                {[Op.like]: `%"magasin":"${magasin.nommagasin}"%`},
                {[Op.like]: `%"magasin":"${magasin.identifiant}"%`}
            ]
        }
    }
}

function getConditionDate(date){
    return sequelize.where(sequelize.fn('date', sequelize.col('timestamp')), sequelize.fn('date', date));
}

function generateExcelArticles(items, title){
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title); // New Worksheet
    addItemsToWorksheet(items, worksheet);
    setExcelStyle(worksheet);
    return workbook.xlsx.writeBuffer({useStyles: true})
}

function addItemsToWorksheet(items, worksheet){
    worksheet.columns = COLONNES_EXCEL_ARTICLE;
    items.forEach((item)=>{
        formatItem(item);
        worksheet.addRow(item);
    })
}

function formatItem(item){
    item.gamme = item.gamme?? "";
    item.designation = item.designation?? "";
}


function setExcelStyle(worksheet){
    worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
    alignColumnAndAddBorder(worksheet)
}

module.exports = {
    verifyDate,
    findMagasinAndVerifyDate,
    getConditionMagasin,
    getConditionDate,
    getConditionCombined,
    LOG_MESSAGE,
    generateExcelArticles
}