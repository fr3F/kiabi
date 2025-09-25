const { alignColumnAndAddBorder, setHeaderResponseAttachementExcel } = require("../../../helpers/excel.helper");
const { verifierExistence, dataToJson } = require("../../../helpers/helpers.helper");
const db = require("./../../../models");
const Catalogues = db.catalogue; 
const Magasin = db.magasin; 
const excelJS = require("exceljs"); // Pour l'export excel

const COLONNES_EXCEL = [
    {header: "Code", key: "code", width: 15},        
    {header: "Désignation", key: "designation", width: 50},        
    {header: "Gamme", key: "gamme", width: 15},        
    {header: "Prix HT", key: "prixht", width: 15},        
    {header: "Prix TTC", key: "prixdevente", width: 15},        
    {header: "Taux TVA", key: "tauxtva", width: 12},
    {header: "Remise", key: "remise", width: 12},
    {header: "Stock", key: "stock", width: 12},
    {header: "Magasin", key: "magasin", width: 20},
    {header: "Code barre", key: "barcode", width: 15},
    {header: "Avec image", key: "avecImage", width: 12},

]



// exporter excel catalogues magasin
async function exporterExcelCatalogueMagasin(idMagasin, res){
    const magasin = await verifierExistence(Magasin, idMagasin, "Magasin");
    const data =dataToJson(await Catalogues.findAll({where: {magasin: magasin.nommagasin}}));
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Catalogues " + magasin.nommagasin); // New Worksheet
    worksheet.columns = COLONNES_EXCEL;
    data.forEach((item)=>{
        item.gamme = item.gamme?? "";
        item.avecImage = item.avecImage? "Oui": "Non";
        worksheet.addRow(item);
    })
    worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
    alignColumnAndAddBorder(worksheet)
    setHeaderResponseAttachementExcel(res, `Catalogues.xlsx`);
    workbook.xlsx.writeBuffer({useStyles: true}).then((r)=>{
        res.send(r)
    }) 
}

module.exports = {
    exporterExcelCatalogueMagasin
}