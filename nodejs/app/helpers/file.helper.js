// const uid2 = require('uid2');
const { readFile } = require('./helpers.helper');
const readerXls = require('xlsx');
const fs = require('fs');
const Path = require('path');
const fsPromises = require('fs').promises;
// const axios = require('axios');
const axios = require('./axios.helpers');
const pdf = require("html-pdf");
const { v4: uuidv4 } = require('uuid');

// Lire une liste dans fichier execFile(base64)
function readListFromExcel64(file64, feuille = 0){
    if(!file64)
        return [];
    file64 = file64.substr(file64.indexOf(',') + 1);
    const bufferExcel = Buffer.from(file64,'base64');
    const workbook = readerXls.read(bufferExcel, { type: 'buffer' });
    const sheetNamesList = workbook.SheetNames;
    let excelData =readerXls.utils.sheet_to_json(workbook.Sheets[sheetNamesList[feuille]])
    return excelData;
}


// Lire une liste dans fichier execFile(base64), en spécifiant la première ligne qui contient les données
function readListFromExcel64LineOption(file64, feuille = 0, firstLine = 1){
    if(!file64)
        return [];
    file64 = file64.substr(file64.indexOf(',') + 1);
    const bufferExcel = Buffer.from(file64,'base64');
    const workbook = readerXls.read(bufferExcel, { type: 'buffer' });
    const sheetNamesList = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNamesList[feuille]]
    

    // Trouver la dernière colonne (ex: 'Z', 'AA', 'AB', ...)
    const lastCol = readerXls.utils.decode_range(sheet['!ref']).e.c;

    // Déterminer la plage totale de lignes
    const lastRow = readerXls.utils.decode_range(sheet['!ref']).e.r;

    // Spécifier la plage à partir de la 6ème ligne pour les noms de colonnes
    const headerRange = { s: { r: firstLine-1, c: 0 }, e: { r: firstLine-1, c: lastCol } };

    // Extraire les noms de colonnes depuis la 6ème ligne
    const headers = readerXls.utils.sheet_to_json(sheet, { header: 1, range: headerRange })[0];

    // Spécifier la plage à partir de la 7ème ligne pour les données
    const dataRange = { s: { r: firstLine, c: 0 }, e: { r: lastRow, c: lastCol } };

    // Convertir la feuille Excel en JSON en utilisant les noms de colonnes extraits
    const jsonData = readerXls.utils.sheet_to_json(sheet, { header: headers, range: dataRange });

    return jsonData;
}

// Lire une liste dans fichier execFile
function readListFromExcel(file){
    if(!file)
        return [];
    const bufferExcel = file["buffer"];
    const workbook = readerXls.read(bufferExcel, { type: 'buffer' });
    const sheetNamesList = workbook.SheetNames;
    let excelData = readerXls.utils.sheet_to_json(workbook.Sheets[sheetNamesList[0]]);
    return excelData;
}

// function generateUniqueFilename(extension) {
//     const uidPart1 = uid2(12); // Generate a random UID of length 12
//     const uidPart2 = uid2(16); // Generate another random UID of length 16
//     const uidPart3 = uid2(20); // Generate another random UID of length 20
//     const uidPart4 = uid2(8); // Generate another random UID of length 20
  
//     return `${uidPart1}-${uidPart2}-${uidPart3}${uidPart4}${extension}`;
// }
  

// Verifier existence fichier si existe
function verifierFichierBool(path){
    let rep = true;
    try{
        let f = readFile(path)
    }
    catch(err){
        rep = false;
    }
    return rep;
}

function addFileStreamRes(filename, path, res){
    let stream = fs.createReadStream(path);               
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename + ";"
    );
    stream.on('open', function () {
        stream.pipe(res);
    })

}


function getDirFilesNames(path) {
  try {
    const fichiers = fs.readdirSync(path);
    const nomsFichiers = fichiers.filter(fichier => {
      const cheminFichier = Path.join(path, fichier);
      return fs.statSync(cheminFichier).isFile();
    });

    return nomsFichiers;
  } catch (erreur) {
    console.error('Erreur lors de la lecture du dossier :', erreur);
    return [];
  }
}



function generateUniqueFileName(extension) {
  // Générer un identifiant unique avec uuid
  const uniqueId = uuidv4();

  // Obtenir le timestamp actuel
  const timestamp = Date.now();

  // Concaténer l'identifiant unique, le timestamp et l'extension du fichier
  const fileName = `${uniqueId}_${timestamp}.${extension}`;

  return fileName;
}

// Copier une image à partir d'un url(télécharger??)
async function copierImageUrl(urlSource, cheminDestinataire) {
    try {
        const reponse = await axios.get(urlSource, { responseType: 'stream' });
        const fluxEcriture = fs.createWriteStream(cheminDestinataire);
        reponse.data.pipe(fluxEcriture);
        await new Promise((resolve, reject) => {
            fluxEcriture.on('finish', resolve);
            fluxEcriture.on('error', reject);
        });
    } catch (erreur) {
        console.error("Une erreur s'est produite lors de la copie de l'image :", erreur);
    }
}


async function createPdfWithFileAsync(html, options, filePath) {
    return new Promise((resolve, reject) => {
        pdf.create(html, options).toFile(filePath, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.filename);
            }
        });
    });
}
module.exports = {
    readListFromExcel64,
    readListFromExcel,
    // generateUniqueFilename,
    verifierFichierBool,
    readListFromExcel64LineOption,
    addFileStreamRes,
    getDirFilesNames,
    generateUniqueFileName,
    copierImageUrl,
    createPdfWithFileAsync
}