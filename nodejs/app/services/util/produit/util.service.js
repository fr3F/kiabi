
// const axios = require('axios');
const { API_REF_FOURNISSEUR } = require('../../../config/environments/mysql/environment');
const { verifierExistence, dataToJson } = require('../../../helpers/helpers.helper');
const db = require('../../../models');
const { getBarcodeProduct } = require('../check-prix.service');
const axios = require('./../../../helpers/axios.helpers');


async function setRefFournisseurs(products, codeColumn = "code", refColumn = 'referenceFournisseur'){
    const apiUrl = API_REF_FOURNISSEUR;
    const articles = products.map((r)=> r[codeColumn]);
    const response = await axios.post(apiUrl, {articles});
    const references = response.data.articles;
    for(const product of products){
        const reference = references.find((r)=> r.code == product[codeColumn]);
        if(reference)
            product[refColumn] = reference.reffourniss;
    }
}

async function getRefFournisseur(code) {
    const apiUrl = API_REF_FOURNISSEUR;
    const response = await axios.post(apiUrl, {articles: [code]});
    const references = response.data.articles;
    const reference = references.find((r)=> r.code == code);
    const refFournisseur = reference? reference.reffourniss: null;
    return { refFournisseur };
}


async function findProduitByBarcodeWithoutMagasin(barcode){
    const barcodeProduct = dataToJson(await getBarcodeProduct(barcode, false));
    if(!barcodeProduct || !barcodeProduct.produit)
        throw new Error("Code barre introuvable");
    barcodeProduct.produit.gamme = barcodeProduct.gammeObj? barcodeProduct.gammeObj.EG_Enumere: '';
    return formatProductBarcodeWithGammes(barcodeProduct.produit);
}

// async function getBarcodeProduct2(barcode) {
//     const include = ["produit", "gammeObj"];
//     const resp = await db.barcode.findOne({where: {barcode}, include });
//     if(resp && resp.produit)
//         return resp;
//     return await db.barcodegifi.findOne({where: {barcode}, include });
// }

async function findProductWithGammes(code, formatForVirement = true){
    const include = [
        "gammes"
    ];
    const resp = await verifierExistence(db.produit, code, "Produit", include, null, "code");
    if(formatForVirement)
        return formatProductWithGammes(resp);
    return resp;
}

function formatProductWithGammes(produit){
    return {
        reference: produit.code,
        designation: produit.fulldesignation || produit.designation,
        gammes: produit.gammes.map((r)=>{ return {id: r.idgamme, name: r.EG_Enumere}})
    }
}

function formatProductBarcodeWithGammes(produit){
    return {
        reference: produit.code,
        designation: produit.fulldesignation || produit.designation,
        gammes: produit.gamme
    }
}




module.exports = {
    setRefFournisseurs,
    getRefFournisseur,
    findProductWithGammes,
    findProduitByBarcodeWithoutMagasin
}
