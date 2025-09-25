const { isDate } = require("../../helpers/form.helper");
const { formatDate, dataToJson, formaterNb, regroupByAttribut, getValeurAttribut, verifierExistence } = require("../../helpers/helpers.helper");
const db = require("../../models");
const sequelize = db.sequelize;

const Ticket = db.Ticket;
const Magasin = db.Magasin;

const TABLE_DATA = "datafacture";
const TABLE_DATALIGNE = "datafactureligne";

const NOT_NULLABLE = [4, 7, 8, 10, 11, 19, 20, 21, 22, 23, 24, 25, 38, 39, 40, 41, 42, 44, 45, 61, 62, 63 ];
const NOT_NULLABLELIGNE = [1, 4, 5, 6, 7, 8, 9, 10, 15, 16, 19, 25, 26, 27, 28, 29, 31, 42, 43, 44, 47, 48];

// const axios = require('axios');
const axios = require('./../../helpers/axios.helpers');

const { API_LAST_FACTURE } = require("../../config/environments/mysql/environment");
const { Op, QueryTypes } = require("sequelize");
const { selectSql } = require("../../helpers/db.helper");

const SEP_DECIMAL = ",";

async function getConditionTicket(date, idParametrage){
    const parametrage = await getConditionParametrage(idParametrage)
    return {
        [Op.and]: [
            sequelize.where(sequelize.fn('date', sequelize.col('datecreation')), sequelize.fn('date', date))
        ],
        magasin: parametrage,
        ventedepot: {[Op.or]: [
            {[Op.ne]: 1},
            {[Op.is]: null}
        ]}
    }
}

async function getTicketsAExporter(date, idParametrage){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const cond = await getConditionTicket(date, idParametrage);
        const tickets = await Ticket.findAll({
        where: cond,
        order: [["codeclient", "ASC"], ["magasin", "ASC"]],
    })
    return dataToJson(tickets);
}


async function getConditionParametrage(idParametrage){
    const parametrage = await verifierExistence(db.parametrageCloture, idParametrage, "Paramétrage", 
        [{model: db.itemParametrageCloture, as: "items", include: ["magasin"]}]
    );
    const nommagasins = parametrage.items.map((r)=> r.magasin.nommagasin);
    return {[Op.in]: nommagasins}
}


async function getAllMagasins(){
    const magasins = dataToJson(await Magasin.findAll());
    for(const magasin of magasins){
        await setLastnumfactMagasin(magasin);
    }
    return magasins;
}

async function setLastnumfactMagasin(magasin, verify = false){
    const apiUrl = API_LAST_FACTURE + (magasin.souche - 1);
    const response = await axios.get(apiUrl);
    magasin.lastnumfacture = response.data.lastnum;
    reduireLastnumFact(magasin, verify);
}

function reduireLastnumFact(magasin, verify){
    if(magasin.lastnumfacture){
        const code = magasin.code?? "";
        let lastNumFacture = parseInt(magasin.lastnumfacture.substring(code.length)) - 1;
        const lastNumMagasin = parseInt(magasin.lastnumfact.substring(code.length));
        if(lastNumMagasin > lastNumFacture) {
            lastNumFacture = lastNumMagasin;
        }
        // if(lastNumFacture < lastNumMagasin && verify)
        //     throw new Error("Veuillez d'abord importer la facture n° " + magasin.lastnumfact + " sur SAGE");
        const lastNumFactureStr = lastNumFacture + "";
        magasin.lastnumfact = code + (lastNumFactureStr.padStart(getNbChiffreFacture(magasin), "0"));
    }
    else{
        magasin.lastnumfact = "";
    }
}

function getNbChiffreFacture(magasin){
    return magasin.nbChiffreNumFacture;
}


function getNumeroFacture(ticket, magasins){
    if(ticket.numeroFacture)
        return ticket.numeroFacture;
    const magasin = magasins.find((r)=> r.nommagasin == ticket.magasin);
    if(!magasin)
        throw new Error("Magasin introuvable pour le ticket " + ticket.numticket);
    if(!magasin.lastnumfact)
        throw new Error("Le magasin n'a pas encore de numéro de la dernière facture");
    let lastNumFacture = 0;
    let code = magasin.code? magasin.code: "";  
    if(magasin.lastnumfact)    {
        lastNumFacture = parseInt(magasin.lastnumfact.substring(code.length));
    }
    lastNumFacture ++;
    const lastNumFactureStr = lastNumFacture + "";
    ticket.numeroFacture = code + (lastNumFactureStr.padStart(getNbChiffreFacture(magasin), "0"));
    magasin.lastnumfact = ticket.numeroFacture ;
    return ticket.numeroFacture;
}

async function updateNumeroFacture(date, idParametrage, transaction){
    const magasins = await getAllMagasins();
    const tickets = await getTicketsAExporter(date, idParametrage);
    setNumeroFactureTickets(tickets, magasins);
    await Ticket.bulkCreate(tickets, {transaction, updateOnDuplicate: ["numeroFacture"]});
    await Magasin.bulkCreate(magasins, {transaction, updateOnDuplicate: ["lastnumfact"]});
    return magasins;
}

function setNumeroFactureTickets(tickets, magasins){
    let magasin = undefined;
    let codeclient = undefined;
    let numeroFacture = undefined;
    for(let ticket of tickets){
        if(magasin != ticket.magasin || codeclient != ticket.codeclient){
            magasin = ticket.magasin;
            codeclient = ticket.codeclient;
            numeroFacture = getNumeroFacture(ticket, magasins);
        }
        if(!ticket.numeroFacture)
            ticket.numeroFacture = numeroFacture;
    }
}


async function generateContentFacture(date, idParametrage, transaction){
    const magasins = await updateNumeroFacture(date, idParametrage, transaction);
    await insertData(date, magasins, idParametrage, transaction);
    return await getContentDataFactures2(transaction);
}

async function getContentDataFactures2(transaction){
    const dataFactures = await selectSql(`SELECT * FROM ${TABLE_DATA}`, transaction);
    const dataLignes = await selectSql(`SELECT * FROM ${TABLE_DATALIGNE}`, transaction);
    await deleteData(transaction);
    return getContentDataFactures(dataFactures, dataLignes);
}

async function deleteData(transaction){
    const sql1 = `DELETE FROM ${TABLE_DATALIGNE}`;
    const sql2 = `DELETE FROM ${TABLE_DATA}`;
    await sequelize.query(sql1, {type: QueryTypes.DELETE, transaction});
    await sequelize.query(sql2, {type: QueryTypes.DELETE, transaction});
}

async function getFactures(date, magasins, idParametrage, transaction) {
    const where = await getConditionTicket(date, idParametrage);
    let tickets = await Ticket.findAll({
        where,
        order: [["numeroFacture", "ASC"]],
        include: ["articles"],
        transaction
    });
    tickets = dataToJson(tickets);
    const clients = await getClients(tickets);
    let codes = [];
    for(const ticket of tickets){
        ticket.client = clients.find((r)=> ticket.codeclient == r.code);
        ticket.magasinObj = magasins.find(r=> r.nommagasin == ticket.magasin);
        codes = codes.concat(getValeurAttribut("code", ticket.articles))
    }
    const cumps = await db.cump.findAll({where: {code: {[Op.in]: codes}}});
    return {factures: regroupByAttribut(tickets , "numeroFacture"), cumps};
}

async function getClients(tickets){
    const codeclients = getValeurAttribut("codeclient", tickets);
    if(!codeclients.length)
        return [];
    return await db.client.findAll({where: {code: {[Op.in]: codeclients}}})
}

async function insertData(date, magasins, idParametrage, transaction){
    const {factures, cumps} = await getFactures(date, magasins, idParametrage, transaction);
    const dateSage = formatDate(new Date(date), "DDMMYY");
    for(const facture of factures){
        await insertDataFacture(facture, dateSage, cumps, transaction);
    }
}

async function insertDataFacture(facture, dateSage, cumps, transaction){
    const data = generateDataFacture(facture, dateSage);
    const id = await sequelize.getQueryInterface().bulkInsert(TABLE_DATA, [data], { transaction, returning: true });
    const datalignes = generateDataLignes(facture, cumps, id);
    if(datalignes.length)
        await sequelize.getQueryInterface().bulkInsert(TABLE_DATALIGNE, datalignes, { transaction });
}

function generateDataLignes(facture, cumps, iddatafacture){
    const resp = [];
    for(const ticket of facture.items){
        ticket.articles.sort((a, b) => a.quantite - b.quantite);
        for(const article of ticket.articles){
            if(article.quantite != 0)
                resp.push(generateDataLigne(article, iddatafacture, ticket.depot, ticket.codeclient, cumps))
        }
    }
    return resp;
}

function generateDataLigne(article, iddatafacture, depot, codeclient, cumps){
    const cumpObj = cumps.find((r)=> r.code == article.code && r.depot == depot);
    const cump = cumpObj? cumpObj.cump: 0;
    const data = {iddatafacture, n28: depot, n42: codeclient};
    data.n1 = "";
    data.n2 = article.code;
    data.n3 = article.designation;
    data.n5 = article.gamme ?? "";
    data.n7 = article.numerodeserie ?? "";
    data.n11 = "1";
    data.n12 = formaterNb(article.prixdevente, 2, SEP_DECIMAL);
    data.n13 = "0,00";
    data.n14 = formaterNb(article.quantite, 2, SEP_DECIMAL);
    data.n15 = data.n14
    article.remise = article.montantremise? 100 * article.montantremise / article.prixtotal: 0;
    if(parseInt(article.remise) != article.remise)
        article.remise = formaterNb(article.remise, 4, SEP_DECIMAL)
    data.n19 = article.remise? (article.remise + "%"): "";
    data.n21 = formaterNb(cump, 2, SEP_DECIMAL);
    data.n22 = "0,00";
    data.n23 = data.n21;
    data.n33 = formaterNb(article.tauxtva, 4, SEP_DECIMAL);
    return data;
}

function generateDataFacture(facture, dateSage){
    const ticket = facture.items[0];
    const data = {};
    const magasin = ticket.magasinObj;
    data.n4 = magasin.souche;
    data.n5 = facture.numeroFacture;
    data.n6 = dateSage;
    data.n9 = ticket.codeclient;
    data.n10 = magasin.depotstockage;
    data.n11 = ticket.client? ticket.client.intitule: "";
    data.n15 = ticket.codeclient;
    data.nomagasin = magasin.nommagasin;
    return data;
}

function getContentDataFactures(dataFactures, dataLignes){
    const rep = ["#FLG 000", "#VER 14"];
    for(const dataFacture of dataFactures){
        rep.push(getContentDataFacture(dataFacture, dataLignes));
    }
    rep.push("#FIN");
    return rep.join("\r\n")
}

function getContentDataFacture(dataFacture, dataLignes){
    const lignes = dataLignes.filter((r)=> r.iddatafacture == dataFacture.id);
    const rep = ['#CHEN'];
    for(let i = 1; i <= 65; i++){
        const value = dataFacture["n"+i];
        if(value != "null" && value != null)
            rep.push(value);
        else{
            if(NOT_NULLABLE.indexOf(i) != -1)
                rep.push("");
            else
                rep.push(value);
        }
    }
    if(lignes.length){
        // rep.push("#CHLI");
        rep.push(getContentDataLignes(lignes));
    }
    return rep.join("\r\n")
}

function getContentDataLignes(dataLignes){
    const rep = [];
    for(const dataLigne of dataLignes){
        rep.push(getContentDataLigne(dataLigne));
    }
    return rep.join("\r\n")
}

// transfert: pour generer fichier transfert
function getContentDataLigne(dataLigne){
    const rep = ["#CHLI"];
    for(let i = 1; i <= 50; i++){
        const value = dataLigne["n"+i];
        if(value != "null" && value != null)
            rep.push(value);
        else{
            if(NOT_NULLABLELIGNE.indexOf(i) != -1)
                rep.push("");
            else
                rep.push(value);
        }
    }

    rep.push("");
    return rep.join("\r\n")
}

module.exports = {
    generateContentFacture,
    setNumeroFactureTickets,
    insertDataFacture,
    getContentDataFactures2,
    setLastnumfactMagasin
}