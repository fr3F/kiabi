// Recuperer les lignes à fusionner
function getLineToMerge(worksheet, columnToMerge = 1){
    const columnValues = {};
    worksheet.eachRow(function(row, rowNumber) {
        const cellValue = row.getCell(columnToMerge).value;
        if (columnValues.hasOwnProperty(cellValue)) {
            columnValues[cellValue].push(rowNumber);
        } else {
            columnValues[cellValue] = [rowNumber];
        }
    });
    return columnValues;
}


// fusionner les lignes
function fusionnerLigneExcel(worksheet, columnNum = 1, columnName = "A"){
    const columnValues = getLineToMerge(worksheet, columnNum)
    Object.keys(columnValues).forEach(function(key) {
        const rowNumbers = columnValues[key];
        if (rowNumbers.length > 1) {
          const startRow = rowNumbers[0];
          const endRow = rowNumbers[rowNumbers.length - 1];
          worksheet.mergeCells(`${columnName}${startRow}:${columnName}${endRow}`);
        }
      });      
}


// Ajouter des bordures au excel
function addBorder(row, borderStyle){
    row.eachCell(function(cell) {
        cell.border = {
        top: borderStyle,
        left: borderStyle,
        bottom: borderStyle,
        right: borderStyle
        };
    });
}

// Aligner verticalement au milieu de chaque cellule et ajouter bordure
// const columnToAlign = 1; // numéro de colonne à aligner 
function alignColumnAndAddBorder(worksheet, columnToAlign = 1){
    // Définir les propriétés de la bordure
    const borderStyle = {
        style: 'thin',
        color: { argb: 'FF000000' }
    };
    worksheet.eachRow(function(row) {
      const cell = row.getCell(columnToAlign);
      cell.alignment = { vertical: 'middle' };
      addBorder(row, borderStyle);
    });    
} 
// Modifier header reponse attachement excel
function setHeaderResponseAttachementExcel(res, filename){
    res.setHeader("Content-Type", "application/xhtml+xml .xls");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename + ";"
    );
}



module.exports = {
    fusionnerLigneExcel,
    alignColumnAndAddBorder,
    setHeaderResponseAttachementExcel
}
