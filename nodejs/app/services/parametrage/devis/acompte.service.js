
const { ErrorCode } = require("../../../helpers/error");
const { validerRequete } = require("../../../helpers/form.helper");
const { verifierExistence } = require("../../../helpers/helpers.helper");
const db = require("./../../../models");
const { TYPE } = require("./util");

const Devis = db.devis;
const Modepaiement = db.modepaiement;

const CODE_JOURNAL = "CAI";
const NO_REGLEMENT = 1;
const TYPE_PAIEMENT = 'cash';

const STATUT = {
    nouveau: "Nouveau",
    encaisse: "Encaissé"
}

async function getAcompte(securedKey){
    if(!securedKey)
        throw new Error("Veuillez renseigner la clé de sécurité");
    const devis = await Devis.findOne({where: {securedKey}, include: ["items"]});
    if(!devis)
        throw new Error("Acompte introuvable");
    if(devis.statut != STATUT.encaisse)
        throw new Error("Acompte invalide");
    let items = devis.items;
    if(devis.type != TYPE.acompte)
        throw new Error("Ce devis n'est pas un acompte")
    return formatAcompte(devis);
}

function formatAcompte(devis){
    return {
        id: devis.id,
        items: devis.items,
        montant: devis.montantAcompte,
        statut: devis.statut,
        modepaiement: devis.modepaiement,
        typepaiement: devis.typepaiement,
        codejournal: devis.codejournal,
        noreglement: devis.noreglement,
    };
}

async function getAcompteByNumero(numero){
    if(!numero)
        throw new Error("Veuillez renseigner la clé de sécurité");
    const where = getConditionNumero(numero);
    const acompte = await Devis.findOne({where, include: ("items")});
    if(!acompte)
        throw new ErrorCode("Acompte introuvable");
    return acompte;    
}

function getConditionNumero(numero){
    return {
        numero, 
        type: TYPE.acompte,
        statut: STATUT.nouveau
    }
}

// Verifier devis si type acompte
async function verifierAcompte(body){
    if(body.type != TYPE.acompte){
        if(!body.designation)
            throw new Error("Veuillez renseigner la désignation");
        body.contactClient = null;
        body.montantAcompte = null;
        return;
    }
    body.designation = null;
    const att = ["client", "contactClient", "montantAcompte", "modepaiement"];
    const nomAtt = ["Client", "Contact du client", "Montant acompte", "Mode de paiement"];
    validerRequete(body, att, nomAtt);
    await verifyModepaiement(body);
}

// Vérifier mode paiement acompte
async function verifyModepaiement(body){
    const mode = await Modepaiement.findOne({where: {
        magasin: body.magasin,
        designation: body.modepaiement
    }});
    if(!mode)
        throw new Error("Mode de paiement introuvable pour le magasin");
    body.codejournal = CODE_JOURNAL;
    body.noreglement = NO_REGLEMENT;
    body.typepaiement = TYPE_PAIEMENT;
}

// Recuperer les acomptes avec statut 'Nouveau' par identifiant magasin
async function getNewAcomptesMagasin(magasin){
    await verifierExistence(db.magasin, magasin, "Magasin", [], null, "identifiant");
    return await Devis.findAll({
        where: {
            magasin,
            statut: STATUT.nouveau,
            type: TYPE.acompte
        }
    })
} 

// Mettre à jour statut acompte
async function updateStatut(id, statut, securedKey){
    verifyUpdateStatut(statut, securedKey);
    const devis = await verifierExistence(Devis, id, "Acompte");
    if(devis.type != TYPE.acompte)
        throw new Error("Ce devis n'est pas un acompte");
    const dataUpdate = { statut };
    if(securedKey)
        dataUpdate.securedKey = securedKey;
    await Devis.update(dataUpdate, {where: {id}});
} 

function verifyUpdateStatut(statut, securedKey){
    // if(!securedKey)
    //     throw new Error("Veuillez renseigner le secured key")
    if(!statut)
        throw new Error("Veuillez renseigner le statut")
}

// Si devis type acompte et statut != Nouveau, modification impossible
function verifyUpdateAcompte(devis){
    if(devis.type != TYPE.acompte)
        return;
    if(devis.statut != STATUT.nouveau)
        throw new Error("Cet acompte n'est pas modifiable");
}

module.exports = {
    getAcompte,
    verifierAcompte,
    getNewAcomptesMagasin,
    updateStatut,
    verifyUpdateAcompte,
    getAcompteByNumero
}