const { sourceDBConfig } = require("../../config/environments/mysql/environment");
const { selectSql } = require("../../helpers/db.helper");
const { isDate } = require("../../helpers/form.helper");
const { formatDate, verifierExistence } = require("../../helpers/helpers.helper");
const mysql2 = require('mysql2');
const db = require("../../models");
const { getConfigurationDbCaisse, pingCaisse } = require("../caisse/util.service");

const COLONNES_TOTAL = ["nbTicket", "nbReference", "qteVendue", "montantTotal", "montantHT"];

function getSqlGetTotal(date, groupBY = true){
    date = formatDate(new Date(date), "YYYY-MM-DD");
    const sql = `SELECT COUNT(DISTINCT t.idticket) nbTicket,
                    COUNT(DISTINCT code) nbReference, SUM(quantite) qteVendue,
                    SUM(a.prixtotal - a.montantremise) montantTotal,
                    SUM(a.quantite * (a.prixdevente * 100 / (100 + a.tauxtva)) * (1 - COALESCE(a.montantremise/a.prixtotal, 0))) montantHT
                    ${groupBY? ', magasin': ''}
                FROM ticket t 
                    JOIN articleticket a ON(t.idticket = a.idticket)
                WHERE date(datecreation) = date('${date}')
                ${groupBY?'GROUP BY magasin': ''}`;
    return sql;
}

// Formule montant HT
// article.puHT = article.prixdevente * 100 / (100 + parseFloat(article.tauxtva)); 
// article.remise = 100 * article.montantremise / article.prixtotal;   
// article.remise = !isNaN(article.remise) ? article.remise: 0;         
// prixHT =  article.quantite * (article.puHT * (1-article.remise/100));

async function getTotalCentral(date, idMagasin){
    const sql =  `SELECT m.*, COALESCE(nbTicket, 0) nbTicket,
                    COALESCE(nbReference, 0) nbReference, COALESCE(qteVendue, 0) qteVendue,
                    COALESCE(montantTotal, 0) montantTotal, COALESCE(montantHT, 0) montantHT
                FROM magasin m 
                    LEFT JOIN 
                        (
                            ${getSqlGetTotal(date)}
                        )
                             t ON(t.magasin = m.nommagasin)
                    ${idMagasin? `WHERE m.id = ${idMagasin}`: ''}
                ORDER BY m.nommagasin`;
    return await selectSql(sql);
}

function getSqlGetTotalCaisse(date, magasin){
    date = formatDate(new Date(date), "YYYY-MM-DD");
    const sql = `SELECT COUNT(DISTINCT t.idticket) nbTicket,
                    COUNT(DISTINCT code) nbReference, SUM(quantite) qteVendue,
                    SUM(a.prixtotal - a.montantremise) montantTotal, nocaisse,
                    SUM(a.quantite * (a.prixdevente * 100 / (100 + a.tauxtva)) * (1 - COALESCE(a.montantremise/a.prixtotal, 0))) montantHT
                FROM ticket t 
                    JOIN articleticket a ON(t.idticket = a.idticket)
                WHERE date(datecreation) = date('${date}') AND magasin = '${magasin}'
                GROUP BY nocaisse`;
    return sql;
}

async function getTotalCentralCaisse(date, magasin){
    const sql =  `SELECT COALESCE(nbTicket, 0) nbTicket,
                    COALESCE(nbReference, 0) nbReference, COALESCE(qteVendue, 0) qteVendue,
                    COALESCE(montantTotal, 0) montantTotal, COALESCE(montantHT, 0) montantHT, 
                    c.nocaisse
                FROM caisses c 
                    LEFT JOIN (${getSqlGetTotalCaisse(date, magasin.nommagasin)}) t ON(t.nocaisse = c.nocaisse)
                WHERE idMagasin = ${magasin.id}
                ORDER BY c.nocaisse`;
    return await selectSql(sql);
}


function initializeTotalDb(dataMagasin){
    for(const col of COLONNES_TOTAL)
        dataMagasin[col + "Db"] = 0;
}

function copyTotalDb(dataMagasin, totalDb, nomCol = "Db"){
    if(!dataMagasin || !totalDb)
        return;
    for(const col of COLONNES_TOTAL)
        dataMagasin[col + nomCol] = totalDb[col];
}

async function setTotalBDMagasin(date, dataMagasin){
    initializeTotalDb(dataMagasin);
    const sql = getSqlGetTotal(date);
    const dbConfig = {...sourceDBConfig};
    dbConfig.database = dataMagasin.nomBase;
    let connection = null;
    try{
        connection = mysql2.createConnection(dbConfig);
        const res = await connection.promise().query(sql);
        copyTotalDb(dataMagasin, res[0][0]);
    }
    catch(err){
        console.log(err)
        // throw err;
    }
    finally{
        try{
            if(connection)
              connection.end(); 
          }
          catch(err){
            throw err;
          }
    }
    
}

async function getControleTicketMagasin(date, idMagasin = null){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const rep = await getTotalCentral(date, idMagasin);
    for(const item of rep){
        await setTotalBDMagasin(date, item);
    }
    return rep;
}


async function getControleTicketCaisse(idMagasin, date){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const magasin = await verifierExistence(db.Magasin, idMagasin, "Magasin", ["caisses"]);
    const rep = await getTotalCentralCaisse(date, magasin);
    await setTotalBDMagasinCaisse(date, rep, magasin);
    return rep;
}

async function setTotalBDMagasinCaisse(date, dataCentral, magasin){
    for(const data of dataCentral)
        initializeTotalDb(data);
    const sql = getSqlGetTotalCaisse(date, magasin.nommagasin);
    const dbConfig = {...sourceDBConfig};
    dbConfig.database = magasin.nomBase;
    let connection = null;
    try{
        connection = mysql2.createConnection(dbConfig);
        const res = await connection.promise().query(sql);
        const sqlCaisse = getSqlGetTotal(date, false); // sql pour recuperer les données dans chaque base caisse 
        for(let data of dataCentral){   // On ajoute les données magasins et données caisses aux données centrales
            const dataMagasin = res[0].find((r)=> r.nocaisse == data.nocaisse);
            if(dataMagasin)
                copyTotalDb(data, dataMagasin);
            await setControleCaisse(data, magasin.caisses, sqlCaisse);
        }            
    }
    catch(err){
        console.log(err)
    }
    finally{
     endConnection(connection)   
    }
}

function endConnection(connection){
    try{
        if(connection)
          connection.end(); 
      }
      catch(err){
        console.log(err)
        throw new Error("Impossible de se connecter à la base de données");
    }
}

async function setControleCaisse(dataCentral, caisses, sqlCaisse){
    const caisse = caisses.find((r)=> r.nocaisse == dataCentral.nocaisse);
    const ping = await pingCaisse(caisse);
    if(!ping)
        return;
    const dbConfig = getConfigurationDbCaisse(caisse);
    let connection = null;
    try{
        connection = mysql2.createConnection(dbConfig);
        const res = await connection.promise().query(sqlCaisse);
        copyTotalDb(dataCentral, res[0][0], "Caisse");
        dataCentral.dataCaisse = true;
    }
    catch(err){
        console.log(err)
        // throw err;
    }
    finally{
        try{
            if(connection)
              connection.end(); 
          }
          catch(err){
          }
    }
}
module.exports = {
    getControleTicketMagasin,
    getControleTicketCaisse
}