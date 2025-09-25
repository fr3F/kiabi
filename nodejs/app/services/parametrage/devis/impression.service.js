const bwipjs = require('bwip-js');
const db = require('../../../models/index');

// Utilisés pour le pdf
const pdf = require("html-pdf");
let fs = require("fs");
let Handlebars = require("handlebars");
const { Op } = require('sequelize');
const { urlBackLocal, zoomPdf } = require('../../../config/environments/mysql/mada/environment');
const { dataToJson, setHeaderResponseAttachementPdf } = require('../../../helpers/helpers.helper');
const { formatDate } = require('date-fns/format');
const {OPTION_PDF_PORTRAIT} =require('../../../helpers/pdf-helper')
const TYPE_IMPRESSION = {
    numero: "numero",
    designation: "designation"
}

async function genererBarCode(barcode){ // generer codebarre pour les devis
    const promise = new Promise((resolve, reject) => {
        const barcodeOptions = {
          bcid: 'code128', // Type de code-barres (ici, code 128)
          text: barcode, // Données à inclure dans le code-barres
          scale: 8, // Échelle du code-barres
          height: 20, // Ajustez la hauteur ici selon vos besoins (en points)
          includetext: false, // Ne pas Inclure le texte sous le code-barres
          width: 75   
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


async function imprimerDevis({data, type, magasin}, res, user){
    verifyTypeImpression(type);
    if(!Array.isArray(data) || !data.length)
        throw new Error("Veuillez renseigner au moins un devis");
    const devis = await getDevisToPrint(type, data, magasin);
    let {html, options} = await getOptionPdfDevis(devis, user); 
    await pdf.create(html, options).toStream(async function (err, stream) {
        if (err) {
            res.status(500).send({message: "Il y a une erreur lors de l'impression en pdf"})
            return;
        }               
        let pdfName = `Devis.pdf`;
        setHeaderResponseAttachementPdf(res, pdfName);
        stream.pipe(res);
    });
}

// Verifier si le type d'impression est valide
function verifyTypeImpression(type){
    for(const t in TYPE_IMPRESSION){
        if(TYPE_IMPRESSION[t] == type)
            return;
    }
    throw new Error("Type d'impression invalide");
}

async function getDevisToPrint(type, data, magasin){
    let condition = {securedKey: {[Op.not]: null}};
    if(magasin)
        condition.magasin = magasin;
    if(type == TYPE_IMPRESSION.numero)
        condition.numero = {[Op.in]: data};
    else{
        if(!magasin)
            throw new Error("Veuillez renseigner le magasin");
        condition.designation = {[Op.in]: data};
    }
    const devis = dataToJson(await db.devis.findAll({where: condition}));
    for(const item of devis)
        item.barcode = await genererBarCode(item.securedKey);
    return devis;
}

async function getOptionPdfDevis(devis, user){
    let source = await fs.readFileSync(global.__basedir + "/app/templates/pdf/devis/barcode-pdf.html", "utf8");
    let template = await Handlebars.compile(source);
    const date = formatDate(new Date(), "DD-MM-YYYY à HH:mm:ss");
    let html = await template({devis, urlBackLocal , zoomPdf, user});
    let options = {...OPTION_PDF_PORTRAIT};
    options.footer = getFooterPDF(user, date);
    return {html, options};
}

// async function generateBarcodes(numeros){
//     const resp = [];
//     for(const numero of numeros){
//         resp.push(await genererBarCode(numero));
//     }
//     return resp;
// }

// Recuperer footer pdf
function getFooterPDF(user, date){
    let source = fs.readFileSync(global.__basedir + "/app/templates/pdf/devis/footer-pdf.html", "utf8");
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

module.exports = {
    imprimerDevis
}