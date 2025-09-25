const { verifierExistence, formatDate } = require("../../helpers/helpers.helper");
const db = require("../../models");

const Caisse = db.Caisse;
const TableSynchro = db.tableSynchro;
const net = require('net');
// const axios = require('axios');
const axios = require('./../../helpers/axios.helpers');
const { API_SYNCHRO_SAGE } = require("../../config/environments/mysql/environment");
const { loggerSynchro } = require("../../helpers/logger");
const { selectSql, executeSql } = require("../../helpers/db.helper");

async function getJsonCaisse(id){
    const caisse = await verifierExistence(Caisse, id, "Caisse", ["magasin"]);
    let rep = {
        "magasin": caisse.magasin.nom,
        "codemagasin": caisse.magasin.code,
        "nocaisse": caisse.nocaisse,
        "count": caisse.count,
        "defaultcompte": caisse.magasin.defaultcompte,
        "defaultdepot": caisse.magasin.defaultdepot,
        "identifiant": caisse.magasin.identifiant,
        "facebook": caisse.magasin.facebook,
        "siteweb": caisse.magasin.siteweb
    };
    return rep;
}

async function getCaisseSync(id){
    const caisse = await verifierExistence(Caisse, id, "Caisse",["magasin"]);
    const destDBConfig = getConfigurationDbCaisse(caisse);
    return {destDBConfig, caisse}
}

function getConfigurationDbCaisse(caisse){
  return {
    host: caisse.adresseIp,
    user: caisse.usernameBdd,
    password: caisse.passwordBdd,
    port: caisse.port,
    database: caisse.nomBdd 
  };
}

// Table à exclure lors de l'installation
const tablesToExclude = ["tcxamp1", "tcxarlp1", "tcxartp2", "tcxcdep1", "tcxclsp1", "tcxeanp1", 
  "tcxfrsp1", "tcxjrap1", "tcxlvsp", "tcxmagp1", "tcxplvp1", "tcxsitp1", "tcxlvsp1", "tva",
  "cloture", "colonnefluxgifi", "datafacture", "datafactureligne", "datareglement", 
  "fluxgifi", "log", "stock", "stocknew",
  "fonctionnalites", "fonctionnalite_roles", "menus", "menu_roles", "modules", "caisses",
  "historique_table_caisses", "table_caisses", "table_synchros", "users", "roles", "v_menu_roles", "v_reglements_encaissement",
  "historiques", "destinataire_mail", "modepaiementstandard", "produitsage", "sftpconfig", "tcxmvtp1", "appros", "item_appros",
  "parametrage_appros", "depot_magasins", "user_magasins", "destinataire_reporting", "parametrage_etiquetages", "ip_magasin", "catalogues",
  "v_reglements_encaissement_date", "v_reglements_encaissement", "v_reglements_ticket_magasin", "v_tcxartp2_full", "v_stock_tcxartp2_full",
  "v_articleticket_date", "receptions", "item_receptions", "commande_a_passer", "control_init", "virements", "item_virements",
  "demande_virements", "item_demande_virements", "qte_depot_demande_virements", 'vouchers', "parametrage_clotures", "caractere_speciaux",
  "articles_gamme2", "monnaies", "v_nomenclature_gamme", "notif_magasin", "transferts", "item_transferts", "ticket_tirage", 
  "inventaire_tmp", "promo_anniversaires", "item_promo_anniversaires", "livraisons", "item_livraisons", "dernier_numeros",
  "proforma", "item_proforma", "historique_prix", "item_historique_prix", "operation_magasins"
]

// Table à créer mais sans données
const tablesNoData = [
  {name: "ticket", id: "idticket"}, 
  {name: "articleticket", id: "idarticleticket"}, 
  {name: "histocode", id: "idhistocode"}, 
  {name: "encaissement", id: "idencaissement"}, 
  {name: "itemencaissement", id: "id"},
  {name: "reglement", id: "idreglement"},
  // {name: "promotion", id: "id"}, 
  // {name: "itempromotion", id: "id"},
  {name: "miseajourtable", id: "id"},
  {name: "prelevement", id: "idprelevement"}
]

function getPathDump(idCaisse){
    const pathDump = `${__basedir}/dump-caisse-${idCaisse}.sql`;
    let path = pathDump.replace('', '/');
    while(path.indexOf("\\")!=-1)
      path = path.replace("\\", "/")
    path = path.substring(1)
    return path;
}
 

function getDataWhereDump(magasin){
    let where =  {
      "tarifmagasin": `magasin ='${magasin}'`,
      "modepaiement": `magasin ='${magasin}'`,
      "remisemagasin": `CT_Num ='${magasin}'`
    };
    for(let table of tablesNoData)
      where[table.name] = `${table.id} is NULL`;
    return where;
}


async function updateMiseAjourTable(destConnection){
  const dateUpdate = new Date();
  dateUpdate.setSeconds(dateUpdate.getSeconds() - 60);  
  const date = formatDate(dateUpdate, 'YYYY-MM-DD HH:mm:ss');
  const query = `UPDATE miseajourtable SET dateModification='${date}'`;
  await destConnection.promise().query(query);
}

async function deleteBarcodeVides(destConnection){
  const query = `DELETE FROM barcode WHERE barcode = ''`;
  await destConnection.promise().query(query);
}

async function generateScriptMiseAJourTable(dateInstallation){
  const date = formatDate(dateInstallation, 'YYYY-MM-DD HH:mm:ss');
   const tables = await db.tableSynchro.findAll();
   if(!tables.length)
     return null;
   let list = [];
   for(const table of tables)
     list.push(`('${table.nom}', '${date}')`);
   return `INSERT INTO miseajourtable (nomtable, dateModification) VALUES ${list.join(", ")}`;
}

async function insertMiseAJourTable(destConnection, dateInstallation, databaseName){
  const sql = await generateScriptMiseAJourTable(dateInstallation);
  if(!sql)
    return;
  await destConnection.promise().query(`USE ${databaseName}`); 
  await destConnection.promise().query(`DELETE FROM miseajourtable`); 
  await destConnection.promise().query(sql);
  await addIndex(destConnection); 
}

const scriptIndex = ` ALTER table gamme ADD INDEX(AR_Ref);
ALTER table nomenclature ADD INDEX(AR_Ref);
ALTER table nomenclature ADD INDEX(AR_Ref);
ALTER table produit ADD INDEX(code);
ALTER table barcode ADD INDEX(barcode);
ALTER table barcodegifi ADD INDEX(barcode);
ALTER table barcode ADD INDEX(codeproduit);
ALTER table barcodegifi ADD INDEX(codeproduit);
ALTER table numerodeserie ADD INDEX(code);
ALTER TABLE tarifmagasin add index(code);
ALTER TABLE remisemagasin add index(Ar_ref);`

async function addIndex(destConnection){
  const sqls = scriptIndex.split(";");
  for(const sql of sqls){
    try{
    await destConnection.promise().query(sql); 
    }
    catch(err){}
  }
}

async function ping(ip, port) {
  return new Promise(resolve => {
    const client = net.createConnection({ port, host: ip });

    client.setTimeout(1000); // Timeout en millisecondes (ajustez selon vos besoins)

    client.on('connect', () => {
      client.end();
      resolve(true);
    });

    client.on('error', () => resolve(false));
    client.on('timeout', () => resolve(false));
  });
}

async function pingCaisse(caisse){
  return await ping(caisse.adresseIp, caisse.port);
} 

async function initSage(){
  try{
    await axios.get(API_SYNCHRO_SAGE.init);
    loggerSynchro.info("Synchronisation (initialisation) par sage")
  }
  catch(err){
    loggerSynchro.error("Erreur de synchronisation(initialisation) par sage");
    loggerSynchro.error(err);
    loggerSynchro.error(err.stack);
  }

}

async function updateSage(){
  try{
    await axios.get(API_SYNCHRO_SAGE.update);
    loggerSynchro.info("Synchronisation (mise à jour) par sage");
  }
  catch(err){
    loggerSynchro.error("Erreur de synchronisation (mise à jour) par sage");
    loggerSynchro.error(err);
    loggerSynchro.error(err.stack);
  }
}

async function synchroSage(){
  await updateSage();
  await initSage();
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



function getSqlInsert(tableSynchro, data, duplicate = true){
  const columns = tableSynchro.colonnes.split(",");
  const values = data.map(record => columns.map(col => record[col]));
  let query =  `INSERT INTO ${tableSynchro.nom} (${columns.join(', ')}) VALUES ? `
  if(duplicate)
      query += `ON DUPLICATE KEY UPDATE ${columns.map(col => `${col} = VALUES(${col})`).join(', ')}`;
  return  {values, query}
}


async function synchroStock(){
  try{
    await axios.get(API_SYNCHRO_SAGE.stock);
    loggerSynchro.info("Synchronisation (stock) par sage")
  }
  catch(err){
    loggerSynchro.error("Erreur de synchronisation(stock) par sage");
    loggerSynchro.error(err);
    loggerSynchro.error(err.stack);
  }
}

async function synchroEmplacement(){
  try{
    await axios.get(API_SYNCHRO_SAGE.emplacement);
    loggerSynchro.info("Synchronisation init(emplacement) par sage")
  }
  catch(err){
    loggerSynchro.error("Erreur de synchronisation(emplacement) par sage");
    loggerSynchro.error(err);
    loggerSynchro.error(err.stack);
  }
}
async function synchroCump(){
  try{
    await axios.get(API_SYNCHRO_SAGE.cump);
    loggerSynchro.info("Synchronisation (cump) par sage")
  }
  catch(err){
    loggerSynchro.error("Erreur de synchronisation(cump) par sage");
    loggerSynchro.error(err);
    loggerSynchro.error(err.stack);
  }
}

async function synchroNumeroDeSerie(){
  try{
    await axios.get(API_SYNCHRO_SAGE.numerodeserie);
    loggerSynchro.info("Synchronisation (numéro de série) par sage")
  }
  catch(err){
    loggerSynchro.error("Erreur de synchronisation(numéro de série) par sage");
    loggerSynchro.error(err);
    loggerSynchro.error(err.stack);
  }
}

async function updateControlInit(){
  const tableSynchros = await TableSynchro.findAll({where: {to_delete: true}});
  for(const table of tableSynchros){
    const sql = `SELECT COUNT(*) nb FROM ${table.nom}`;
    const res = await selectSql(sql);
    if(!res[0].nb){
      await updateControlInitDb(1);
      return;
    }
  }
  await updateControlInitDb(0);
}

async function updateControlInitDb(value = 1){
  const sqlDelete = `DELETE FROM control_init`;
  const sqlUpdate = `INSERT INTO control_init VALUES (${value})`;
  await db.sequelize.transaction(async (transaction)=>{
    await executeSql(sqlDelete, transaction);
    await executeSql(sqlUpdate, transaction);  
  })
}

async function getErrorControlInit(){
  const sql = `SELECT * FROM control_init`;
  const res = await selectSql(sql);
  if(!res.length)
    return {error: true};
  return res[0];
}

module.exports = {
    getJsonCaisse,
    getCaisseSync,
    tablesToExclude,
    getPathDump,
    getDataWhereDump,
    updateMiseAjourTable,
    insertMiseAJourTable,
    getConfigurationDbCaisse,
    pingCaisse,
    initSage,
    updateSage,
    endConnection,
    getSqlInsert,
    synchroStock,
    updateControlInit,
    getErrorControlInit,
    synchroCump,
    synchroEmplacement,
    deleteBarcodeVides,
    synchroNumeroDeSerie
}