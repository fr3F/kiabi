const { sourceDBConfig,  mysqlPath } = require('../../config/environments/mysql/environment');
const mysql2 = require('mysql2'); 
const mysqldump = require('mysqldump');
const dumpFile = "dump-caisse.sql"
const { verifierExistence, formatDate } = require("../../helpers/helpers.helper");
const db = require("./../../models");

const Caisse = db.Caisse;


var cp = require("child_process");
const util = require('util');
const { STATUT_CAISSE, STATUS_CAISSE } = require('./env');
const { tablesToExclude, getDataWhereDump, getPathDump, insertMiseAJourTable } = require('./util.service');
const exec = util.promisify(require('child_process').exec);


async function createDatabase(destConnection, databaseName){
  let createQuery = `CREATE DATABASE ${databaseName}`;
  let dropQuery = `DROP DATABASE IF EXISTS ${databaseName}`;
  await destConnection.promise().query(dropQuery);
  await destConnection.promise().query(createQuery);
}

async function createDestinationDatabaseAndCopyTables(destDBConfig, databaseName, idCaisse, magasin) {
  let destConnection = null;
  try {
    destConnection = mysql2.createConnection(destDBConfig);
    await createDatabaseDump(magasin, idCaisse);
    await createDatabase(destConnection, databaseName);
    await importBdd(idCaisse, databaseName, destDBConfig);
    let dateInstallation = new Date();
    await insertMiseAJourTable(destConnection, dateInstallation, databaseName);
    return await updateCaisse(idCaisse, dateInstallation);
  } catch (error) {
    console.log(error)
    throw new Error('Erreur lors de la création de la base de données de destination');
  } finally {
    try{
      if(destConnection)
        destConnection.end(); 
    }
    catch(err){
      console.log(err)
      throw new Error('Erreur lors de la création de la base de données de destination');
    }
  }
}

async function importBdd(idCaisse, databaseName, destDBConfig){
  let path = getPathDump(idCaisse);
    // Executer le dump
    var cmdLine = getCmdImport(destDBConfig, databaseName, path);
    const { stdout, stderr } = await exec(cmdLine);
    if(stderr){
      if(stderr.indexOf("[Warning]") == -1)
        throw new Error("Erreur lors de l'import");
    }
}

function getCmdImport(destDBConfig, databaseName, path){
  return `${mysqlPath} --host=${destDBConfig.host} --port=${destDBConfig.port} --user=${destDBConfig.user} --password=${destDBConfig.password} --skip-ssl ${databaseName} < ${path}`
}

// Creer le fichier dump.sql
async function createDatabaseDump(magasin, idCaisse) {
  await mysqldump({
    connection: sourceDBConfig,
    dumpToFile: `dump-caisse-${idCaisse}.sql`,
    exclude: tablesToExclude,
    dump: { 
      schema: { 
        table: { dropIfExist: true },
        format: false,
        view: false
      },
      data: {
        format: false,
        maxRowsPerInsertStatement: 10000,
        returnFromFunction: true,
        lockTables: false,
        where: getDataWhereDump(magasin)
      },
      trigger: false, 
      tables: tablesToExclude,
      excludeTables: true, 
    },
  })
}

async function installCaisse(id){
  const caisse = await verifierExistence(Caisse, id, "Caisse",["magasin"]);
  const destDBConfig = {
    host: caisse.adresseIp,
    user: caisse.usernameBdd,
    password: caisse.passwordBdd,
    port: caisse.port
  };
  return await createDestinationDatabaseAndCopyTables(destDBConfig, caisse.nomBdd, caisse.id, caisse.magasin.identifiant);
}

async function updateCaisse(id, dateInstallation){
  const data = {dateInstallation, status: STATUT_CAISSE.installe}
  await Caisse.update(data, {where: {id}});
  data.nomStatus = STATUS_CAISSE[data.status - 1];
  return data;
}

module.exports = {
    createDestinationDatabaseAndCopyTables,
    installCaisse
}