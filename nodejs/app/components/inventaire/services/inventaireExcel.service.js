const ExcelJS = require("exceljs");
const {
  fusionnerLigneExcel,
  alignColumnAndAddBorder,
} = require("../../../helpers/excel.helper");
const inventaireService = require("./inventaire.service");

class InventaireExcelService {
  async generateExcel(idinventaire, search = "") {
    // Récupérer les données depuis le service Inventaire
    const rows = await inventaireService.exportInventaireDetail(
      idinventaire,
      search
    );

    // Création du fichier Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventaire");

    worksheet.columns = [
      { header: "EAN Code", key: "eanCode", width: 15 },
      { header: "Couleur", key: "color", width: 20 },
      { header: "Taille", key: "size", width: 10 },
      { header: "Style Code", key: "styleCode", width: 15 },
      { header: "Désignation", key: "designation", width: 25 },
      { header: "Date début", key: "datesnapshot", width: 20 },
      { header: "Quantité", key: "stock", width: 15 },
      { header: "Inventaire", key: "count", width: 10 },
      { header: "Date d'inventaire", key: "datemodif", width: 20 },
    ];

    // Ajout des données
    worksheet.addRows(rows);

    // Appliquer helpers
    fusionnerLigneExcel(worksheet, 1, "A"); // fusionner col A
    alignColumnAndAddBorder(worksheet, 1); // alignement + bordure

    return workbook;
  }
}

module.exports = new InventaireExcelService();
