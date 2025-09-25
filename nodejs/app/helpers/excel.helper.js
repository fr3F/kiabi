// Recuperer les lignes à fusionner
function getLineToMerge(worksheet, columnToMerge = 1){
    const columnValues = {};
    worksheet.eachRow(function(row, rowNumber) {
        const cellValue = row.getCell(columnToMerge).value ?? "__EMPTY__"; // gérer cellules vides
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

// Ajouter des bordures à une cellule
function addBorderToCell(cell, borderStyle){
    cell.border = {
        top: borderStyle,
        left: borderStyle,
        bottom: borderStyle,
        right: borderStyle
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' }; // centrage complet
}

// Ajouter bordures à toutes les cellules d’une ligne
function addBorder(row, borderStyle){
    // Si certaines cellules sont vides, parcourir jusqu'à la dernière colonne utilisée
    const lastCol = row.worksheet.columnCount; 
    for(let i=1; i<=lastCol; i++){
        const cell = row.getCell(i);
        addBorderToCell(cell, borderStyle);
    }
}

// Aligner et ajouter bordure à toutes les cellules du tableau
function alignColumnAndAddBorder(worksheet){
    const borderStyle = {
        style: 'thin',
        color: { argb: 'FF000000' }
    };
    worksheet.eachRow(function(row) {
        addBorder(row, borderStyle);
    });
}

// Définir le header pour l’export Excel
function setHeaderResponseAttachementExcel(res, filename){
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
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
