const { Op, QueryTypes } = require("sequelize");
const { dataToJson, verifierExistence } = require("../../helpers/helpers.helper");
const db = require("./../../models");
const { findMagasinByIp } = require("../magasin/magasin.service");
const { ErrorCode } = require("../../helpers/error");
const { MAGASIN_LS } = require("../../config/environments/mysql/environment");

const Produit = db.produit;
const BarcodeGifi = db.barcodegifi;
const Barcode = db.barcode;

const RemiseMagasin = db.remisemagasin;
const TarifMagasin = db.tarifmagasin;

// Include nécéssaire pour calculer les prix d'un articles 
const include = {model: Produit, as: "produit", include: [
    "baremespourcentages",
]}

async function checkPrixArticleLSParCode(code){
    const magasin = await verifierExistence(db.magasin, MAGASIN_LS, "Magasin", [], null, "identifiant");
    return await checkPrixArticleParCode(code, magasin.id, null);
}

async function checkPrixArticleParCode(code, idMagasin, gamme){
    const magasin = await verifierExistence(db.magasin, idMagasin, "Magasin");
    const produit = await verifierExistence(Produit, code, "Produit", ["baremespourcentages"], null, "code");
    const produitBarcode = {produit, gammeObj: {EG_Enumere: gamme}};
    produitBarcode.codeproduit = code;
    return await checkPrixArticleProduitBarcode(produitBarcode, magasin);
}

async function checkPrixArticleParCode2(code, magasin, gamme){ // Magasin deja recuperé
    const produit = await verifierExistence(Produit, code, "Produit", ["baremespourcentages"], null, "code");
    const produitBarcode = {produit, gammeObj: {EG_Enumere: gamme}};
    produitBarcode.codeproduit = code;
    return await checkPrixArticleProduitBarcode(produitBarcode, magasin);
}


async function checkPrixArticleParProduit(produit, magasin, gamme){ // Magasin deja recuperé
    const produitBarcode = {produit, gammeObj: {EG_Enumere: gamme}};
    produitBarcode.codeproduit = produit.code;
    return await checkPrixArticleProduitBarcode(produitBarcode, magasin);
}
async function checkPrixArticle(barcode, ip){
    const magasinObj = await verifyMagasin(ip);
    const gifi = magasinObj.gifi;
    let produitBarcode = await getBarcodeProduct(barcode, gifi);
    produitBarcode = dataToJson(produitBarcode);
    return await checkPrixArticleProduitBarcode(produitBarcode, magasinObj);
}


async function checkPrixArticleMagasin(barcode, idMagasin, magasinObj){
    magasinObj = magasinObj?? await verifierExistence(db.magasin, idMagasin, "Magasin");
    const gifi = magasinObj.gifi;
    let produitBarcode = await getBarcodeProduct(barcode, gifi);
    produitBarcode = dataToJson(produitBarcode);
    return await checkPrixArticleProduitBarcode(produitBarcode, magasinObj);
}


async function checkPrixArticleProduitBarcode(produitBarcode, magasinObj){
    const gifi = magasinObj.gifi;
    // Toujours utilisés le calcul par gifi
    const magasin = magasinObj.identifiant;
    const code = produitBarcode.codeproduit;
    const noDb = produitBarcode.produit.noDb;
    produitBarcode.produit.tarifmagasin = noDb? produitBarcode.produit.tarifMagasin: await getDataMagasin(magasin, TarifMagasin, code, "magasin", "code");
    // produitBarcode.produit.remisemagasin = noDb? produitBarcode.produit.remiseMagasin: await getDataMagasin(magasin, RemiseMagasin, code, "CT_Num", "AR_Ref");
    await calculerPrix(produitBarcode, gifi, magasinObj.nommagasin);
    produitBarcode.idMagasin = magasinObj.id;
    produitBarcode.gamme = produitBarcode.gammeObj? produitBarcode.gammeObj.EG_Enumere: '';
    return produitBarcode;

}   

// Récupérer données filtrées par magasin
async function getDataMagasin(magasin, model, code, colonneMagasin, colonneCode){
    const where = {};
    where[colonneMagasin] = magasin;
    where[colonneCode] = code;
    return await model.findOne({where, order: [["dateModification", "DESC"]]});
}

// recuperer barcode avec produit
async function getBarcodeProduct(barcode, gifi){
    const option = {where:{ barcode: barcode }, include: [include, "gammeObj"]};
    let produitBarcode = await Barcode.findOne(option);
    let produitBarcodeGifi = await BarcodeGifi.findOne(option);
    
    // Si code produit non disponible dans produit
    produitBarcodeGifi = produitBarcodeGifi && produitBarcodeGifi.produit? produitBarcodeGifi: null;
    produitBarcode = produitBarcode && produitBarcode.produit? produitBarcode: null;

    const code = produitBarcode? produitBarcode.codeproduit: '';
    const codeGifi = produitBarcodeGifi? produitBarcodeGifi.codeproduit: '';

    if(!code && !codeGifi)    
        throw new Error(`Produit introuvable(${barcode})`);
    
    if(gifi){
        if(codeGifi && produitBarcodeGifi)
            return produitBarcodeGifi;
        return produitBarcode;
    }
    if(code)
        return produitBarcode;
    return produitBarcodeGifi;
}

// Vérifier le magasin
async function verifyMagasin(ip){
    // if(!gifi)
    //     return;
    if(!ip)
        throw new Error("Votre ip n'est pas configuré");
    return await findMagasinByIp(ip);
    // return await verifierExistence(db.magasin, magasin, "Magasin", [], null, "identifiant");
}

// Calculer le prix pour le barcode produit
async function calculerPrix(produitBarcode, gifi, magasin){
    // if(!gifi)
    //     calculerPrixNonGifi(produitBarcode);
    // else
        await calculerPrixGifi(produitBarcode, magasin);
}

function calculerPrixNonGifi(produitBarcode){
    produitBarcode.taux = 1;
    produitBarcode.tauxremisesage = 0;
    applyBaremePourcentage(produitBarcode);
    setRemiseMagasin(produitBarcode);
}

// Récupérer bareme pourcentage active pour le produit
function getBaremePourcentage(produitBarcode){
    const datedujour = new Date();
    return produitBarcode.produit.baremespourcentages.find((barm)=>{
        const debut = new Date(barm.TF_Debut);
        debut.setHours(0,0,0,0);

        const fin = new Date(barm.TF_Fin);
        fin.setHours(23,59,59,999);

        if (fin.getFullYear() == 1900)  // Si pas de date fin
            return datedujour >= debut;
        return datedujour >= debut && datedujour <= fin;
    })
}

function applyBaremePourcentage(produitBarcode){
    const bareme = getBaremePourcentage(produitBarcode);
    if(bareme){
        produitBarcode.taux = (100 - bareme.valeur) / 100;
        produitBarcode.promo = true;
    }
}

// Appliquer remise magasin pour produit non gifi
function setRemiseMagasin(produitBarcode){
    const remise = produitBarcode.produit.remisemagasin;
    const tarifmagasin = produitBarcode.produit.tarifmagasin;
    if(remise)
        applyRemise(produitBarcode, remise, tarifmagasin);
    else{
        setPrixNormal(produitBarcode, tarifmagasin)
    }
    applyTaux(produitBarcode);

}

// Calculer prix si sans remise
function setPrixNormal(produitBarcode, tarifmagasin){
    if(tarifmagasin && tarifmagasin.prixventeht != 0){
        if(produitBarcode.promo)
            setPrixPrincipal(produitBarcode);
        else{
            produitBarcode.prix = tarifmagasin.prixventeht * (1 + produitBarcode.produit.tauxtva/100); 
            produitBarcode.prixht = tarifmagasin.prixventeht;
        }  
    }
    else{
        setPrixPrincipal(produitBarcode);
    }
}
// Modifier le prix par prix principal
function setPrixPrincipal(produitBarcode){
    produitBarcode.prix = produitBarcode.produit.prixttcprincipal;
    produitBarcode.prixht = produitBarcode.produit.prixhtprincipal;

}

// Appliquer la remise si existe
function applyRemise(produitBarcode, remise, tarifmagasin){
    produitBarcode.estRemise = true;
    produitBarcode.tauxremisesage = remise.AC_Remise;
    const tauxRemise = (1 - produitBarcode.tauxremisesage/100);
    if(tarifmagasin && tarifmagasin.prixventeht != 0){
        if(produitBarcode.promo) // Si déjà promotion(bareme pourcentage)
            setPrixPrincipal(produitBarcode); // Utiliser prix principal
        else{
            // Utiliser prix tarif magasin
            produitBarcode.promo = true;
            produitBarcode.prix = (tarifmagasin.prixventeht + tarifmagasin.prixventeht * produitBarcode.produit.tauxtva/100);
            produitBarcode.prix = produitBarcode.prix * tauxRemise;
            produitBarcode.prixht = tarifmagasin.prixventeht * tauxRemise;
        }
    }
    else{   // Appliquer remise si sans tarif magasin
        produitBarcode.prix = produitBarcode.produit.prixttcprincipal * tauxRemise;
        produitBarcode.prixht = produitBarcode.produit.prixhtprincipal * tauxRemise;
    }
}

// Appliquer le taux
function applyTaux(produitBarcode){
    produitBarcode.prix = produitBarcode.prix * produitBarcode.taux;
    produitBarcode.prixht = produitBarcode.prixht * produitBarcode.taux;
}

// Taux vip(promotion vip), magasin gifi, avec gamme
async function getTauxVip(codearticle, magasin, typeprom, gamme){ // typeprom: 1 remise, 2 promotion
    let sql = `SELECT i.taux AC_Remise, typePromotion
                    FROM promotion p
                    JOIN itempromotion i on (i.idpromotion = p.id)
                WHERE i.codearticle = ? AND p.datedebut <= now() and p.datefin >= now() and p.magasin = ? and p.typeprom = ? 
                    AND i.supprime IS NOT TRUE AND p.supprime IS NOT TRUE
                `;
    const replacements=  [ codearticle, magasin, typeprom ];
    if(gamme && gamme.EG_Enumere){
        sql += ' and UPPER(i.gamme) = ?';
        replacements.push(gamme.EG_Enumere.toString().toUpperCase());
    }
    sql += " ORDER BY i.id DESC";
    const resp = await db.sequelize.query(sql, 
        {
            replacements,
            type: QueryTypes.SELECT
        });
    if(resp.length)
        return resp[0];
    return null;
}

// Calculer prix pour produit gifi
async function calculerPrixGifi(produitBarcode, magasin){
    const noDb = produitBarcode.produit.noDb; // Si donnée déjà recupere
    const remise = noDb? produitBarcode.produit.remiseGifi: await getTauxVip(produitBarcode.codeproduit, magasin, 1, produitBarcode.gammeObj);    // Recuperer remise gifi
    const prixVip = noDb? produitBarcode.produit.prixVipGifi: await getTauxVip(produitBarcode.codeproduit, magasin, 2, produitBarcode.gammeObj); // Recuperer prix vip
    const tarifmagasin = produitBarcode.produit.tarifmagasin;
    if(remise){
        if(remise.typePromotion == "Montant")
            applyPromotionMontant(produitBarcode, remise);
        else
            applyRemise(produitBarcode, remise, tarifmagasin);
    }  
    else
        setPrixNormal(produitBarcode, tarifmagasin);
    applyPrixVip(produitBarcode, prixVip);
}

// Appliquer promotion avec type Montant
function applyPromotionMontant(produitBarcode, remise){
    produitBarcode.promo = true;
    produitBarcode.prix = remise.AC_Remise;
    produitBarcode.prixht = remise.AC_Remise / (1 + produitBarcode.produit.tauxtva/100);
}
// Appliquer prix vip
function applyPrixVip(produitBarcode, prixVip){
    if(prixVip){
        produitBarcode.estvip = true;
        produitBarcode.tauxvip = prixVip.AC_Remise;
        produitBarcode.prixvip = produitBarcode.prix - produitBarcode.prix*prixVip.AC_Remise/100;
    }
    else {
        produitBarcode.estvip = false;
        produitBarcode.tauxvip = 0;
    }
}


module.exports = {
    checkPrixArticle,
    getBarcodeProduct,
    checkPrixArticleParCode,
    checkPrixArticleMagasin,
    checkPrixArticleParCode2,
    checkPrixArticleParProduit,
    checkPrixArticleLSParCode
}
