const mysql = require('mysql2');

const db = require("../../models");
const { verifierExistence, formatDate, dataToJson } = require('../../helpers/helpers.helper');
const { sourceDBConfig } = require('../../config/environments/mysql/environment');
const { getCaisseSync, updateMiseAjourTable, pingCaisse, updateSage, initSage, getSqlInsert, synchroStock, updateControlInit, synchroCump, synchroEmplacement, deleteBarcodeVides, synchroNumeroDeSerie } = require('./util.service');
const { getCount } = require('../../helpers/db.helper');
const { reinstallCaisse } = require('./re-install.service');
const { loggerSynchro } = require('../../helpers/logger');
const { initializeStockMagasins } = require('../../components/others/utils/services/stocks.service');

const Caisse = db.Caisse;

// Tables filtrées par magasin
const TABLES_FILTRE = [
    {nom: "tarifmagasin", colonne: "magasin"},
    {nom: "modepaiement", colonne: "magasin"},
    {nom: "remisemagasin", colonne: "CT_Num"},
]

async function synchronizeCaisseNumero(nocaisse, codemagasin){
    const magasin = await verifierExistence(db.magasin, codemagasin, "Magasin", [], null, "code");
    const caisse = await Caisse.findOne({where: {idMagasin: magasin.id, nocaisse}});
    if(!caisse)
        throw new Error("Caisse introuvable");
    await synchroNumeroDeSerie();
    await synchronizeCaisse(caisse.id);
}

async function synchronizeCaisse(id, sourceConnect, to_delete){
    const {caisse, destDBConfig} = await getCaisseSync(id);
    const destConnection = mysql.createConnection(destDBConfig);
    const sourceConnection = sourceConnect? sourceConnect: mysql.createConnection(sourceDBConfig);
    try {
        if(!sourceConnect)
            await sourceConnection.promise().connect();
        await destConnection.promise().connect();
        await transfertData(sourceConnection, destConnection, caisse, to_delete);
        if(to_delete === false) // Si initialisation des tables, ne pas mettre à jour miseajourtable
            await updateMiseAjourTable(destConnection);
        // await deleteBarcodeVides(destConnection);
        // await synchronizeBarcode(destConnection, id);
    }
    catch(err){
        loggerSynchro.error(err.stack)
        loggerSynchro.error(err)
        throw new Error("Une erreur s'est produite lors de la synchronisation de la caisse " + caisse.nocaisse + " - " + caisse.magasin.nom)
    }
    finally{            
        if(!sourceConnect)
            sourceConnection.end();
        destConnection.end();
    }
}

async function synchronizeBarcode(destConnection, id){
    const countCentral = await getCount("SELECT * FROM barcode");
    const sqlDest = "SELECT COUNT(barcodeid) nb FROM barcode";
    const rep = await destConnection.promise().query(sqlDest);  
    if(countCentral != rep[0][0].nb){
        console.log("Reinstallation barcode")
        await reinstallCaisse(id, ["barcode"]);
    }

}

async function synchronizeCaisses(caisses, to_delete){
    const sourceConnection = mysql.createConnection(sourceDBConfig);
    const rep = []
    try {    
        await sourceConnection.promise().connect();
        for(const caisse of caisses){
            let message;
            const ping = await pingCaisse(caisse);  // Tester si la caisse est pingable pour la synchroniser
            if(!ping)
                message = `Caisse n° ${caisse.nocaisse} non connectée(${caisse.magasin.nommagasin})`;
            else
                await synchronizeCaisse(caisse.id, sourceConnection, to_delete).then(
                    (r)=> {
                        message = `Caisse n° ${caisse.nocaisse} synchronisée(${caisse.magasin.nommagasin})`;
                        loggerSynchro.info(message);
                    }
                ).catch((err)=>{
                    loggerSynchro.error(message)
                    message = `Caisse n° ${caisse.nocaisse} non synchronisée(${caisse.magasin.nommagasin})`;
                })
            rep.push(message); // Renvoyer pour avoir une liste des resultats des synchronisations
        }
    }
    catch(err){
        console.log(err)
        loggerSynchro.error(err.stack)
        loggerSynchro.error(err)
    }
    finally{
        sourceConnection.end();
    }
    return rep;
}

async function synchronizeAllCaisses(to_delete = false){
    const caisses = await Caisse.findAll({include: ["magasin"]});
    await synchronizeCaisses(caisses, to_delete);
}

async function synchronizeCaissesMagasin(idMagasin){
    
    const magasin = await verifierExistence(db.magasin, idMagasin, "Magasin");
    loggerSynchro.info("Synchronisation magasin " + magasin.nommagasin);
    await initSage();
    await updateSage();
    const caisses = await Caisse.findAll({where: {idMagasin}, include: ["magasin"]});
    const resp = await synchronizeCaisses(caisses);
    loggerSynchro.info("Synchronisation magasin " + magasin.nommagasin + " effectuée");
    return resp;
}

async function transfertData(sourceConnection, destConnection, caisse, to_delete){
    const tableUpdates = await getMiseAjourTable(destConnection);
    const conditionSynchro = to_delete === undefined? {to_delete: true}: {to_delete};
    const tableSynchros = await db.tableSynchro.findAll({where: conditionSynchro});
    for(const table of tableUpdates){
        const tableFiltre = TABLES_FILTRE.find((r)=> r.nom == table.nomtable);
        if(tableFiltre){
            await transfertDataTableByMagasin(sourceConnection, destConnection, table, tableSynchros, caisse.magasin.identifiant, tableFiltre.colonne);
        }
        else{
            await transfertDataTable(sourceConnection, destConnection, table, tableSynchros);
        }
    }
}   


async function transfertDataTable(sourceConnection, destConnection, tableUpdate, tableSynchros){
    const tableSynchro = tableSynchros.find((r)=> tableUpdate.nomtable == r.nom);
    if(!tableSynchro)   return;
    const dateModif = new Date(tableUpdate.dateModification);
    // dateModif.setDate(dateModif.getDate()-5)
    const date = formatDate(dateModif, 'YYYY-MM-DD HH:mm:ss');
    const condition = getConditionDate(date, tableSynchro, '');
    const sqlSource = `SELECT * FROM ${tableUpdate.nomtable} 
                        ${condition? `WHERE ${condition}`: ''} `;
    await transfertData2(sqlSource, sourceConnection, tableSynchro, destConnection)
}

function getConditionDate(date, tableSynchro, and = ' ' ){
    return !tableSynchro.to_delete? `${tableSynchro.nomDernierModif} > '${date}' ${and} `: ''  
}

async function transfertDataTableByMagasin(sourceConnection, destConnection, tableUpdate, tableSynchros, magasin, colonneMagasin = 'magasin'){
    const tableSynchro = tableSynchros.find((r)=> tableUpdate.nomtable == r.nom);
    if(!tableSynchro)
        return;
    const dateModif = new Date(tableUpdate.dateModification);
    const date = formatDate(dateModif, 'YYYY-MM-DD HH:mm:ss');
    const sqlSource = `SELECT * FROM ${tableUpdate.nomtable} WHERE 
        ${getConditionDate(date, tableSynchro, 'AND')} 
        ${colonneMagasin} = '${magasin}'`;
    await transfertData2(sqlSource, sourceConnection, tableSynchro, destConnection);
}

async function deleteData(destConnection, tableSynchro){
    if(tableSynchro.to_delete){
        const sql = `DELETE FROM ${tableSynchro.nom}`;
        await destConnection.promise().query(sql);
    }
}

async function transfertData2(sqlSource, sourceConnection, tableSynchro, destConnection){
    try{
        await deleteData(destConnection, tableSynchro);
        const dataLength = 1000;
        let i = 0;
        while(true){
            const sql = `${sqlSource} LIMIT ${dataLength} OFFSET ${i*dataLength}`;
            let data = await selectSql(sourceConnection, sql);
            if(!data.length)
                break;
            await insertDataTable(data, tableSynchro, destConnection);
            if(data.length < dataLength)
                break;
            i ++;
        }
    }
    catch(err){
        loggerSynchro.error(err.stack)
        loggerSynchro.error(err)
    }

}

async function insertDataTable(data, tableSynchro, destConnection){
    if(!data.length)
        return;
    const {query, values} = getSqlInsert(tableSynchro, data);
    await destConnection.promise().query(query, [values], true);
}

async function selectSql(connection, sql){
    const rep = await connection.promise().query(sql);
    return rep[0];
}

async function getMiseAjourTable(destConnection){
    const rep = await destConnection.promise().query('SELECT * FROM miseajourtable');
    return rep[0];
}

async function synchoniseAllCaissesUpdate(){
    loggerSynchro.info("Synchronisation (mise à jour) début");
    await updateSage();
    await synchronizeAllCaisses();
    // await db.barcode.destroy({where: {barcode: ''}});
    loggerSynchro.info("Synchronisation (mise à jour)");
    setTimeout(async ()=>{
        if(new Date().getHours()< 21)
            await synchoniseAllCaissesUpdate();
    }, 60000);
}


async function synchoniseAllCaissesInit(){
    await initSage();
    await synchroStock();
    await synchroEmplacement();
    await synchroCump();
    await synchronizeAllCaisses(true);
    await initializeStockMagasins();
    await updateControlInit();
    loggerSynchro.info("Synchronisation (initialisation)");    
    // setTimeout(async ()=>{
    //     if(new Date().getHours()< 19)
    // await synchoniseAllCaissesInit();
    // }, 300000);
}

module.exports = {
    synchronizeCaisse,
    getSqlInsert,
    synchronizeAllCaisses,
    synchronizeCaissesMagasin,
    synchoniseAllCaissesInit,
    synchoniseAllCaissesUpdate,
    synchronizeCaisseNumero
}