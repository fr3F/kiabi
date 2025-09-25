const { ErrorCode } = require("../../../../helpers/error");
const { verifierExistence, dataToJson, isNumber } = require("../../../../helpers/helpers.helper");
const { produit: Produit, barcode: Barcode, barcodegifi } = require("../../../../models");
var numberRegex = /^\d+$/;
// Créer un nouveau code-barre
async function createBarcode(code, barcode) {
    const produit = await verifyCodeProduit(code);  // Vérifie si le produit existe
    const gammeObj = await verifyBarcode(produit, barcode, null);  // Vérifie le code-barre
    const resp = dataToJson(await Barcode.create(barcode));  // Création du code-barre
    resp.gammeObj = gammeObj;  // Associe la gamme au code-barre
    return resp;
}

// Mettre à jour un code-barre existant
async function updateBarcode(id, barcode) {
    const old = await verifierExistence(Barcode, id, "Code barre", [], null, "barcodeid");  // Vérifie si le code-barre existe
    const produit = await verifyCodeProduit(old.codeproduit);  // Vérifie si le produit est valide
    barcode.gammeObj = await verifyBarcode(produit, barcode, id);  // Vérifie et assigne la gamme
    await Barcode.update(barcode, { where: { barcodeid: id } });  // Met à jour le code-barre
    return barcode;
}

function verifyConditionnement(barcode){
    if(!barcode.isConditionne)
        barcode.conditionnement = 1;
    else if(!isNumber(barcode.conditionnement) || barcode.conditionnement <= 1)
        throw new ErrorCode("Veuillez renseigner un conditionnement superieur à 1")
}

// Vérifier et retourner la gamme associée au code-barre
async function verifyBarcode(produit, barcode, id) {
    if (!barcode.barcode) 
        throw new ErrorCode("Veuillez renseigner le code barre");  // Vérifie si le code-barre est vide
    barcode.barcode = barcode.barcode.trim();  // Supprime les espaces inutiles
    verifyFormatBarcode(barcode.barcode)
    barcode.codeproduit = produit.code;  // Associe le code produit
    barcode.dateModification = new Date();  // Ajoute la date de modification
    verifyConditionnement(barcode); 
    // Vérifie si le code-barre existe déjà dans la base de données
    const tmp = await Barcode.findOne({ where: { barcode: barcode.barcode } });
    if (tmp && tmp.barcodeid != id) 
        throw new ErrorCode("Ce code barre est déjà utilisé");
   // Si le produit a des gammes, valide la gamme
    return verifyGamme(produit, barcode);
}

function verifyFormatBarcode(barcode){
    if(!barcode || barcode.length > 13 || !numberRegex.test(barcode))
        throw new ErrorCode(`Veuillez renseigner un code barre 13 caractères maximum(${barcode})`);  // Vérifie si le code-barre est vide
}

function verifyGamme(produit, barcode){
    if (produit.gammes.length) {
        const gamme = produit.gammes.find(r => barcode.gamme == r.AG_No);
        if (!gamme) throw new ErrorCode("Veuillez renseigner une gamme valide");
        return gamme;
    } else {
        barcode.gamme = 0;  // Définit une gamme par défaut si aucune n'est trouvée
        return null;
    }
}

// Vérifier l'existence d'un produit
async function verifyCodeProduit(code) {
    return await verifierExistence(Produit, code, "Produit", ["gammes"], null, "code");
}

// Supprimer un code-barre en le vidant
async function deleteBarcodeGeneric(id, Model) {
    await verifierExistence(Model, id, "Code barre", [], null, "barcodeid");  // Vérifie si le code-barre existe
    // const dateModification = new Date();  // Ajoute la date de modification
    await Model.destroy({ where: { barcodeid: id } });  // Supprime le code-barre
    // await Model.update({ barcode: '', dateModification }, { where: { barcodeid: id } });  // Vide le champ du code-barre
}

// Supprimer un code-barre en le vidant
async function deleteBarcode(id) {
    await deleteBarcodeGeneric(id, Barcode)
}

// Supprimer un code-barre en le vidant
async function deleteBarcodeGifi(id) {
    await deleteBarcodeGeneric(id, barcodegifi)
}

module.exports = {
    createBarcode,
    updateBarcode,
    deleteBarcode,
    deleteBarcodeGifi,
    verifyFormatBarcode
};
