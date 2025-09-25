
const helper = require("../../../../../helpers/helpers.helper");
const pdf = require("html-pdf");
let fs = require("fs");
let Handlebars = require("handlebars");
const { zoomPdf, urlBackLocal } = require("../../../../../config/environments/mysql/environment");
const { OPTION_PDF_PORTRAIT } = require("../../../../../helpers/pdf-helper");
const { genererBarCodeImage } = require("../../../../../helpers/barcode.helper");
const { ErrorCode } = require("../../../../../helpers/error");

const TEMPLATE_PATH = global.__basedir + "/app/templates/pdf/barcode/barcode-pdf.html"


async function imprimerBarcodes(barcodes, user){
    await setBarcodesToPrint(barcodes);
    let {html, options} = await getOptionPdfBarcodes(barcodes, user); 
    return new Promise(async (resolve, reject)=>{
        await pdf.create(html, options).toStream(async function (err, stream) {
            if (err)
                reject(err);
            else
                resolve({ stream });               
        });        
    })
}

async function setBarcodesToPrint(barcodes) {
    verifyBarcodes(barcodes);
    for(const barcode of barcodes){
        barcode.image = await genererBarCodeImage(barcode.barcode, 5, null, 9);
        setInfoText(barcode);
    }
}

function setInfoText(barcode){
    barcode.infoText = barcode.code;
    if(barcode.gamme)
        barcode.infoText += ` - ${barcode.gamme.toString().substring(0, 10)}`;
    if(barcode.qte > 1)
        barcode.infoText += ` x ${barcode.qte}`;
}

function verifyBarcodes(barcodes){
    if(!Array.isArray(barcodes))
        throw new ErrorCode("Veuillez renseigner les codes barres");
}

async function getOptionPdfBarcodes(barcodes, user){
    let source = await fs.readFileSync(TEMPLATE_PATH, "utf8");
    let template = await Handlebars.compile(source);
    const date = helper.formatDate(new Date(), "DD-MM-YYYY à HH:mm:ss")
    let html = await template({barcodes, urlBackLocal, zoomPdf, user, date});
    let options = OPTION_PDF_PORTRAIT;
    // options.border = '5mm';
    return {html, options};
}

module.exports = {
    imprimerBarcodes
}