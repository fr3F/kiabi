const { Op } = require("sequelize");
const { selectSql } = require("../../../helpers/db.helper");
const { validerRequete, isDate } = require("../../../helpers/form.helper");
const helper = require("../../../helpers/helpers.helper");

const db = require("./../../../models");
const sequelize = db.sequelize;

const Devis = db.devis;
const Magasin = db.magasin;
const ItemDevis = db.itemDevis;

const { escape } = require("mysql2");

const { generateSecureToken } = require('n-digit-token');

const { types, TYPE } = require("./util");
const { verifierAcompte, verifyUpdateAcompte } = require("./acompte.service");
const { verifierAccesConnecte } = require("../../acces/fonctionnalite.service");
const TOUT_TYPE_FONCTIONNALITE = 136; // accès à tous les types

async function verifierDevis(body, id, isAdmin) {
    const att = ["type", "magasin"];
    const nomAtt = ["Type", "Magasin"];
    validerRequete(body, att, nomAtt);
    // if(!isAdmin && body.type != TYPE.acompte)
    //     body.type = TYPE.normal;
    if (!types.includes(body.type))
        throw new Error("Veuillez renseigner un type valide");
    verifierDateDevis(body);
    await helper.verifierExistence(Magasin, body.magasin, "Magasin", [], null, 'identifiant');
    await verifierAcompte(body);
    if (body.type == TYPE.promo && (!body.items || !body.items.length))
        throw new Error("Veuillez renseigner au moins un élément");
    // await helper.verifierAttributUnique(Devis, body.numero, id, "numero", "Numéro")
}


function verifierDateDevis(body) {
    if (body.type == TYPE.promo) {
        if (!body.dateDebut || !body.dateFin || !isDate(body.dateDebut) || !isDate(body.dateFin))
            throw new Error("Veuillez renseigner la date de fin et date de début");
        if (new Date(body.dateDebut) >= new Date(body.dateFin))
            throw new Error("La date de début doit être avant la date de fin");
    }
    else {
        body.dateDebut = null;
        body.dateFin = null;
    }

}


async function createDevis(body, idUser, isAdmin) {  // isAdmin est modifié(parametrable dans fonctionnalité)
    await verifierDevis(body, null, isAdmin);
    body.statut = "Nouveau";
    body.creePar = idUser;
    body.securedKey = generateKey(body.type);
    let resp;
    await sequelize.transaction(async (transaction) => {
        resp = (await Devis.create(body, { transaction }));
        await insertItems(resp.id, body.items, transaction);
        resp = await Devis.findByPk(resp.id, { transaction });
    })
    return resp;
}


async function updateDevis(id, body, isAdmin) {
    const old = await helper.verifierExistence(Devis, id, "Devis");
    verifyUpdateAcompte(old);
    await verifierDevis(body, id, isAdmin);
    if (!old.securedKey)
        body.securedKey = generateKey(body.type);
    await sequelize.transaction(async (transaction) => {
        await Devis.update(body, { transaction, where: { id } });
        await insertItems(id, body.items, transaction);
    })
    return body;
}

async function deleteDevis(id) {
    const devis = await helper.verifierExistence(Devis, id, "Devis");
    if (devis.statut != 'Nouveau')
        throw new Error("Ce devis ne peut pas être supprimé")
    await sequelize.transaction(async (transaction) => {
        await ItemDevis.destroy({ where: { idDevis: id }, transaction });
        await Devis.destroy({ where: { id }, transaction });
    });
}

async function getListDevis(req, acompte) {
    let { page, limit, offset } = helper.getVarNecessairePagination(req);
    let option = await getOptionGetList(req, limit, offset, acompte);
    let rep = await Devis.findAndCountAll(option);
    rep = helper.dataToJson(rep);
    await addMagasinDevis(rep.rows);
    return helper.getPagingData(rep, page, limit)
};

async function addMagasinDevis(list) {
    const magasins = await db.magasin.findAll();
    for (const item of list) {
        item.magasinObj = magasins.find((r) => r.identifiant == item.magasin);
    }
}

async function getOptionGetList(req, limit, offset, acompte) {
    let filters = await getFiltreRecherche(req, acompte);
    return {
        where: filters,
        include: ["createur", "magasinObj"],
        limit, offset,
        order: [["numero", "DESC"]]
    };
}

async function getFiltreRecherche(req, acompte) {
    let filters = helper.getFiltreRecherche(req, ["numero", "designation"]);
    if (!req.query.search)
        filters = {};
    await addFiltreMagasin(req, filters);
    // const toutType = await verifierAccesConnecte(TOUT_TYPE_FONCTIONNALITE, req);
    if (acompte)
        filters.type = TYPE.acompte;
    else if (req.query.type)
        filters.type = req.query.type;
    // else if(!toutType)  // isAdmin est modifié(parametrable dans fonctionnalité)
    //     filters.type = TYPE.normal;
    else
        filters.type = { [Op.in]: [TYPE.normal, TYPE.promo] };
    return filters;
}

async function addFiltreMagasin(req, filters) {
    const user = await db.user.findByPk(req.userId, { include: ["magasins"] });
    if (user.magasins.length)
        filters.magasin = { [Op.in]: user.magasins.map((r) => r.identifiant) };
}

async function findById(id) {
    let rep = await helper.verifierExistence(Devis, id, "Devis", ["items", "createur"], null, "id", [[{ model: db.itemDevis, as: "items" }, "id", "ASC"]]);
    rep.nomType = types[rep.typeprom - 1];
    return rep;
}

async function insertItems(idDevis, items, transaction) {
    if (!items.length)
        return;
    for (const item of items)
        item.idDevis = idDevis;
    await ItemDevis.destroy({ where: { idDevis }, transaction });
    await ItemDevis.bulkCreate(items, { transaction });
}


async function searchClient(search) {
    search = escape(`%${search.trim()}%`);
    const sql = `SELECT intitule FROM client WHERE intitule LIKE ${search} LIMIT 25`;
    const rep = await selectSql(sql);
    return helper.getValeurAttribut("intitule", rep);
}

async function generateNumDevis() {
    const sql = `SELECT MAX(id) num FROM devis`;
    const data = await selectSql(sql);
    const nextId = data[0].num ? parseInt(data[0].num) + 1 : "1";
    return "D" + ("" + nextId).padStart(8, "0");
}

async function getProduitByCode(itemcode) {
    itemcode = escape(itemcode.trim());
    const sql = `SELECT * FROM produit WHERE code = ${itemcode}`;
    const rep = await selectSql(sql);
    if (!rep.length)
        return null;
    const sqlGammes = `SELECT * FROM gamme WHERE AR_Ref = ${itemcode}`;
    rep[0].gammes = await selectSql(sqlGammes);
    return rep[0];
}


async function searchProduit(search) {
    search = escape(`%${search.trim()}%`);
    const sql = `SELECT itemcode FROM cat_catalogs WHERE itemcode LIKE ${search} LIMIT 25`;
    const rep = await selectSql(sql);
    return helper.getValeurAttribut("itemcode", rep);
}
function devisValidItems(devis) {
    if (devis.type == TYPE.normal)
        return true;
    const date = new Date();
    return new Date(devis.dateDebut) <= date && new Date(devis.dateFin) >= date;
}

async function encaisserDevis(numero) {
    const devis = await Devis.findOne({ where: { numero } });
    if (!devis)
        throw new Error("Devis introuvable");
    if (devis.statut != "Nouveau")
        throw new Error("Le devis n'a pas le statut \"Nouveau\"");
    await Devis.update({ statut: "Encaissé" }, { where: { numero } });
}

async function searchNumeroDevis(search, acompte) {
    search = escape(`%${search.trim()}%`);
    search = search.substring(1, search.length - 1);
    const where = { numero: { [Op.like]: search } };
    if (acompte)
        where.type = TYPE.acompte;
    else
        where.type = { [Op.in]: [TYPE.normal, TYPE.promo] };
    const devis = await Devis.findAll({ where });
    return helper.getValeurAttribut("numero", devis);
}

// Utiliser pour l'impression(rechercher par désignation, par code)
async function searchDevis(search, column = "code", magasin) { // column: numero, designation 
    if (!search)
        return [];
    search = escape(`%${search.trim()}%`);
    search = search.substring(1, search.length - 1);

    const where = { type: { [Op.in]: [TYPE.normal, TYPE.promo] } };
    if (magasin)
        where.magasin = magasin;
    where[column] = { [Op.like]: search };
    const devis = await Devis.findAll({
        where,
        attributes: [column],
        group: [column],
        limit: 50
    });
    return helper.getValeurAttribut(column, devis);
}

async function scanDevis(numero) {
    const devis = await Devis.findOne({ where: { numero } });
    if (devis.statut != "Nouveau")
        throw new Error("Ce devis n'est pas nouveau");
    await Devis.update({ statut: "Scanné" }, { where: { id: devis.id } });
}



async function getItemsDevisBySecuredKey(securedKey, magasin) {
    if (!securedKey)
        throw new Error("Veuillez renseigner la clé de sécurité");
    if (!magasin)
        throw new Error("Veuillez renseigner le magasin");
    const devis = await Devis.findOne({ where: { securedKey }, include: ["items"] });
    if (!devis)
        throw new Error("Devis introuvable");
    let items = devis.items;
    if (devis.type != TYPE.promo || magasin != devis.magasin || devis.statut != "Nouveau" || !devisValidItems(devis))
        items = [];
    await updateStatutScanne(devis);
    return {
        items,
        type: devis.type,
        statut: devis.statut
    };
}

async function updateStatutScanne(devis) {
    if (devis.statut == 'Scanné' || devis.type != TYPE.promo || new Date(devis.dateDebut) > new Date())
        return;
    await Devis.update({ statut: "Scanné" }, { where: { id: devis.id } });
}

async function getItemsDevisByNumero(numero) {
    if (!numero)
        throw new Error("Veuillez renseigner le numéro");
    const devis = await Devis.findOne({ where: { numero }, include: ["items"] });
    if (!devis)
        throw new Error("Devis introuvable");
    if (devis.type == TYPE.promo)
        return [];
    return devis.items;
}

const LENGTH_TOKEN = 13;

function generateKey(type) {
    //     const secret = numero + new Date().toString();
    //     return bcrypt.hashSync(secret, 8);
    if (type == TYPE.acompte)
        return null;
    // return "ACP" + generateSecureToken(LENGTH_TOKEN);
    else if (type == TYPE.promo)
        return "PRM" + generateSecureToken(LENGTH_TOKEN);
    return generateSecureToken(LENGTH_TOKEN);
}
module.exports = {
    createDevis,
    getListDevis,
    findById,
    updateDevis,
    deleteDevis,
    searchClient,
    generateNumDevis,
    getProduitByCode,
    searchProduit,
    getItemsDevisBySecuredKey,
    encaisserDevis,
    searchNumeroDevis,
    scanDevis,
    getItemsDevisByNumero,
    TOUT_TYPE_FONCTIONNALITE,
    generateKey,
    searchDevis
}