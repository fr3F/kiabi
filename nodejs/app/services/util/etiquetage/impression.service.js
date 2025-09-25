const { Op } = require('sequelize');
const { readListFromExcel64 } = require('../../../helpers/file.helper');
const { verifierExistence, dataToJson, formatDate, setHeaderResponseAttachementPdf, ecrireFichier, formaterNb } = require('../../../helpers/helpers.helper');
const db = require('../../../models');

const Parametrage = db.parametrageEtiquetage;
const Barcode = db.barcode;
const BarcodeGifi = db.barcodegifi;
const bwipjs = require('bwip-js');
const excelJS = require("exceljs"); // Pour l'export excel


const pdf = require("html-pdf");
let fs = require("fs");
let Handlebars = require("handlebars");
const { urlBackLocal, zoomPdf, DEVISE } = require('../../../config/environments/mysql/environment');
const { OPTION_PDF_PORTRAIT } = require('../../../helpers/pdf-helper');
const { formatNombre } = require('../../../helpers/util.helper');
const { checkPrixArticleParCode2, checkPrixArticleMagasin } = require('../check-prix.service');
const { alignColumnAndAddBorder, setHeaderResponseAttachementExcel } = require('../../../helpers/excel.helper');

async function verifierParametrage(idParametrage){
    return await verifierExistence(Parametrage, idParametrage, "Paramétrage étiquetage");
}

function getLongueurDesignation(parametrage){
    return parametrage.largeur * 0.22;  // O.22 pour font-size: 7 pt
}

// // Calculer margin top 
// function calculMarginTop(hauteur, fontSize){ // hauteur et fontsize de la

// }

async function imprimerEtiquetage({idParametrage, nombre, file, codes, idMagasin, logo, fontFamily, fontSize, fileBarcode}, res, user){
    const nombres = verifierNombre(nombre);
    const parametrage = await verifierParametrage(idParametrage);
    const longueurDesignation = getLongueurDesignation(parametrage);
    const magasin = await verifierExistence(db.magasin, idMagasin, "Magasin");
    magasin.logo = logo? magasin.logo: ''; // Si on ne doit pas afficher le logo
    codes = await verifierCodes(codes, file, longueurDesignation, magasin, fileBarcode);
    let {html, options} = await getOptionPdfEtiquetage(parametrage, user, nombres, magasin, 
        codes, fontFamily, fontSize); 
    await pdf.create(html, options).toStream(async function (err, stream) {
        if (err) {
            res.status(500).send({message: "Il y a une erreur lors de l'impression en pdf"})
            return;
        }               
        let pdfName = `Etiquetages.pdf`;
        setHeaderResponseAttachementPdf(res, pdfName);
        stream.pipe(res);
    });
}

async function getArticleSansCodeBarre(file, codes){
    if(file)
        codes = readListFromExcel64(file);
    if(!codes.length)   
        throw new Error("Veuillez renseigner au moins un code");
    const option = getOptionFindBarcode(codes);
    const barcodes = dataToJson(await Barcode.findAll(option));
    const barcodegifis = dataToJson(await BarcodeGifi.findAll(option));
    await setBarCodeCodes(codes, barcodes, barcodegifis);
    codes = codes.filter((r)=> !r.barcode || ( r.barcode instanceof Object && !r.barcode.barcode));
    return codes;
}



async function getOptionPdfEtiquetage(parametrage, user, nombres, magasin, codes, fontFamily, fontSize){
    let source = await fs.readFileSync(__basedir + "/app/templates/pdf/etiquetage/etiquetage-pdf.html", "utf8");
    let template = await Handlebars.compile(source);
    const date = formatDate(new Date(), "DD-MM-YYYY à HH:mm:ss");
    // const lineheight = parametrage.hauteur / 4; 
    let html = await template({parametrage, codes, magasin, urlBackLocal , zoomPdf, user, nombres,
        fontFamily, fontSize
    });
    let options = {...OPTION_PDF_PORTRAIT};
    options.footer = getFooterPDF(user, date);
    ecrireFichier(__basedir + "/test.html", html);
    return {html, options};
}

// Recuperer footer pdf
function getFooterPDF(user, date){
    let source = fs.readFileSync(__basedir + "/app/templates/pdf/etiquetage/footer-pdf.html", "utf8");
    let template = Handlebars.compile(source);
    let html = template({user, date});
    while(html.indexOf("numpage")> -1)
        html = html.replace("numpage", "{{page}}");
    return {
        height: '15mm',
        contents: {
            default: html
        },
    }
}
// Verifier si nombre valide et retourner un tableau de nombre de la taille du nombre utilisé pour le pdf
function verifierNombre(nombre){
    if(isNaN(nombre) || nombre <= 0)
        throw new Error("Veuillez renseigner un nombre positif")
    const result = [];
    for (let i = 1; i <= nombre; i++) {
        result.push(i);
    }
    return result;
}

async function verifierCodes(codes, file, longueurDesignation, magasin, fileBarcode){
    codes = await getCodesToPrint(codes, file, magasin, fileBarcode);
    
    const option = getOptionFindBarcode(codes); // Pour recuperer les codes barres non vides associé aux produits
    const barcodes = dataToJson(await Barcode.findAll(option));
    const barcodegifis = dataToJson(await BarcodeGifi.findAll(option));
    await setBarCodeCodes(codes, barcodes, barcodegifis, longueurDesignation);
    codes = codes.filter((r)=> r.barcode && r.barcode.barcode);
    if(!codes.length)
        throw new Error("Code barre introuvable");
    return codes;
}

async function getCodesToPrint(codes, file, magasin, fileBarcode) {
    if(file)
        codes = await getCodesFromFiles(codes, file, magasin);
    else if(fileBarcode)
        codes = await getCodesFromFilesBarcode(codes, fileBarcode, magasin);
    else
        codes = await getCodesFromArrays(codes, magasin);
    if(!codes.length)   
        throw new Error("Veuillez renseigner au moins un code");
    return codes
}

async function getCodesFromFiles(codes, file, magasin) {
    codes = readListFromExcel64(file);
    await setPrixCodes(codes, magasin)
    return  codes;
}

async function getCodesFromFilesBarcode(codes, fileBarcode, magasin) {
    const barcodes = readListFromExcel64(fileBarcode);
    codes = await getBarcodesWithPrix(barcodes, magasin);
    return  codes;
}

async function getCodesFromArrays(codes, magasin){
    const dataCodes = codes.filter((r)=> !r.barcode);
    const dataBarcodes = codes.filter((r)=> r.barcode);
    await setPrixCodes(dataCodes, magasin);
    const resp = await getBarcodesWithPrix(dataBarcodes, magasin);
    return resp.concat(dataCodes);
}


// Pour recuperer les codes barres à partir des produits(non vide)
function getOptionFindBarcode(codes){
    const codeproduits = codes.map((r)=> r.code);
    const option = {
        where: {
            codeproduit: {[Op.in]: codeproduits}, 
            barcode: {
                [Op.and]: [
                    {[Op.not]: null}, 
                    {[Op.ne]: ''}
                ]
            }
        }, 
        include: ["produit", "gammeObj"]
    };
    return option;
}
    
async function setPrixCodes(codes, magasin){
    for(const code of codes){
        try{
            const prix = await checkPrixArticleParCode2(code.code, magasin, code.gamme);
            code.prix = prix.prixvip? prix.prixvip: prix.prix; 
        }
        catch(err){
            console.log("Erreur lors de l'impression etiquettage");
        }
    }
}

async function getBarcodesWithPrix(barcodes, magasin){
    const resp = [];
    for(const barcode of barcodes){
        const result = await checkPrixArticleMagasin(barcode.barcode, magasin.id, magasin);
        const prixValue = result.prixvip? result.prixvip: result.prix;
        resp.push({
            prix: prixValue,
            barcode: result
        });
    }
    return resp;
}

// Ajouter code barres pour les code produit avec gamme
async function setBarCodeCodes(codes, barcodes, barcodegifis, longueurDesignation){
    for(const code of codes){
        if(!code.barcode)
            setBarcodeForCode(code, barcodes, barcodegifis)
        await formatBarcodePrint(code, longueurDesignation);
    }
} 

function setBarcodeForCode(code, barcodes, barcodegifis){
    let barcode = findBarcodeFromCode(code, barcodes)
    if(!barcode)
        barcode = findBarcodeGifiFromCode(code, barcodegifis);
    code.barcode = barcode;
}

function findBarcodeFromCode(code, barcodes){
    let func = (r)=> r.codeproduit == code.code && r.gamme && r.gammeObj.EG_Enumere == code.gamme && r.conditionnement == 1;
    if(!code.gamme)
        func = (r)=> r.codeproduit == code.code && !r.gamme && r.conditionnement == 1;
    return barcodes.find(func);
}

function findBarcodeGifiFromCode(code, barcodesgifi){
    let func = (r)=> r.codeproduit == code.code && r.gamme && r.gammeObj.EG_Enumere == code.gamme;
    if(!code.gamme)
        func = (r)=> r.codeproduit == code.code && !r.gamme;
    return barcodesgifi.find(func);
}


async function formatBarcodePrint(code, longueurDesignation){
    if(code.barcode && code.barcode.barcode){
        setDesignation(code, longueurDesignation);
        code.barcode.barcodeImg = await genererBarCode(code.barcode.barcode);
        if(code.barcode.produit){
            multiplyPrixConditionnement(code)
            code.barcode.produit.prixttcprincipal = formatNombre(code.prix);
            code.barcode.produit.prixttcprincipal = code.barcode.produit.prixttcprincipal.split(',')[0] + " " + DEVISE ;    
        }
    }
}

function setDesignation(code, longueurDesignation){
    code.barcode.designation = code.barcode.codeproduit  
    if(code.barcode.conditionnement > 1)
        code.barcode.designation += ` x${code.barcode.conditionnement}`;
    code.barcode.designation += " - " + code.barcode.produit.fulldesignation;
    if(longueurDesignation)
        code.barcode.designation = code.barcode.designation.substring(0, longueurDesignation); 

}

function multiplyPrixConditionnement(code){
    if(code.barcode.conditionnement){
        code.prix = code.prix * code.barcode.conditionnement; 
    }
}

async function genererBarCode(barcode){
    const promise = new Promise((resolve, reject) => {
        const barcodeOptions = {
          bcid: 'code128', // Type de code-barres (ici, code 128)
          text: barcode, // Données à inclure dans le code-barres
          scale: 5, // Échelle du code-barres
          height: 20, // Ajustez la hauteur ici selon vos besoins (en points)
          includetext: true, // Inclure le texte sous le code-barres
          width: 80   
        };    
        bwipjs.toBuffer(barcodeOptions, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer.toString('base64'));
          }
        });
    });
    const resp = await promise;
    return 'data:image/png;base64,' + resp;
}

// Utilisé pour l'export excel des articles sans code barre 
const COLONNES_EXCEL_SANS_BARCODE = [
    {header: "Code", key: "code", width: 15},        
    {header: "Gamme", key: "gamme", width: 30},        
]

// exporter excel articles sans code barre
async function exporterExcelArticleSansCodeBarre(data, res){
    if(!Array.isArray(data) || !data.length)
        throw new Error("Veuillez renseigner les articles")
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Articles sans code barre"); // New Worksheet
    worksheet.columns = COLONNES_EXCEL_SANS_BARCODE;
    data.forEach((item)=>{
        item.gamme = item.gamme?? "";
        worksheet.addRow(item);
    })
    worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
    alignColumnAndAddBorder(worksheet)
    setHeaderResponseAttachementExcel(res, `Articles-sans-code-barre.xlsx`);
    workbook.xlsx.writeBuffer({useStyles: true}).then((r)=>{
        res.send(r)
    }) 
}

module.exports = {
    imprimerEtiquetage,
    getArticleSansCodeBarre,
    exporterExcelArticleSansCodeBarre
}