const { genererBarCodeImage } = require("../../../../../helpers/barcode.helper");
const { ErrorCode } = require("../../../../../helpers/error");
const { isNumber, verifierExistence, formatDate } = require("../../../../../helpers/helpers.helper");
const db = require("../../../../../models");

const pdf = require("html-pdf");
let fs = require("fs");
let Handlebars = require("handlebars");
const { OPTION_PDF_PORTRAIT } = require("../../../../../helpers/pdf-helper");
const { urlBackLocal, zoomPdf } = require("../../../../../config/environments/mysql/environment");

const TEMPLATE_PATH = global.__basedir + "/app/templates/pdf/barcode/one-barcode-pdf.html";

async function printOneBarcode(id, nombre, user) {
    return printOneBarcodeGeneric(id, nombre, user, db.barcode);
}

async function printOneBarcodeGifi(id, nombre, user) {
    return printOneBarcodeGeneric(id, nombre, user, db.barcodegifi);
}

async function printOneBarcodeGeneric(id, nombre, user, BarcodeModel){
    const nombres = validateNombreAndGenerateArray(nombre);
    const barcode = await findBarcodeToPrint(id, BarcodeModel);
    let {html, options} = await getOptionPdfBarcodes(barcode, user, nombres); 
    return makePromisePdf(html, options);    
}

function makePromisePdf(html, options){
    return new Promise(async (resolve, reject)=>{
        await pdf.create(html, options).toStream(async function (err, stream) {
            if (err)
                reject(err);
            else
                resolve({ stream });               
        });        
    })
}

async function findBarcodeToPrint(id, BarcodeModel) {
    const resp = await verifierExistence(BarcodeModel, id, "Code barre", ["produit", "gammeObj"], null, "barcodeid");
    await setBarcodeImage(resp);
    setConditionnement(resp);
    setGammeString(resp);
    return resp;
}

async function setBarcodeImage(barcode) {
    barcode.barcodeImage = await genererBarCodeImage(barcode.barcode, 5, null, 9)
}

function setConditionnement(barcode){
    barcode.isConditionne = barcode.conditionnement > 1;
}

function setGammeString(barcode){
    if(barcode.gammeObj)
        barcode.gammeStr = barcode.gammeObj.EG_Enumere;
}

function validateNombreAndGenerateArray(nombre){
    if(!isNumber(nombre) || nombre < 1)
        throw new ErrorCode("Veuillez renseigner un nombre valide");
    return generateNombreArray(nombre);
}

function generateNombreArray(nombre){
    const result = [];
    for (let i = 1; i <= nombre; i++) {
        result.push(i);
    }
    return result;
}

async function getOptionPdfBarcodes(barcode, user, nombres){
    let source = await fs.readFileSync(TEMPLATE_PATH, "utf8");
    let template = await Handlebars.compile(source);
    const date = formatDate(new Date(), "DD-MM-YYYY à HH:mm:ss")
    let html = await template({barcode, urlBackLocal, zoomPdf, user, nombres, date});
    let options = OPTION_PDF_PORTRAIT;
    return {html, options};
}

module.exports = {
    printOneBarcode,
    printOneBarcodeGifi
}
