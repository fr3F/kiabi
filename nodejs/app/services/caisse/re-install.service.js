const { getCaisseSync, tablesToExclude, getDataWhereDump, getPathDump, updateMiseAjourTable, insertMiseAJourTable } = require("./util.service");

const tableDeleted = ["barcode", "caisse", "client", "depot", "famille", "gamme", 
"magasin", "modepaiement", "nomenclature", "paramreglementsage",
"passworduser", "produit", "produitslocaux", "remisemagasin", "utilisateurs", "numerodeserie", "baremespourcentage", 
"tarifmagasin", "barcodegifi", "autorisezero", "clientvip"
]
const util = require('util');

const mysql = require('mysql2');
const mysqldump = require('mysqldump');
const { sourceDBConfig, mysqlPath } = require("../../config/environments/mysql/environment");

const exec = util.promisify(require('child_process').exec);
const db = require('./../../models');
const { verifierExistence } = require("../../helpers/helpers.helper");

async function deleteData(destConnection, tables){
    for(const tableName of tables){
        await destConnection.promise().query(`DROP TABLE ${tableName} IF EXISTS `);
    }
}

async function reinstallCaisse(id, tables){
    if(!tables)
      tables = tableDeleted;
    const {destDBConfig, caisse} = await getCaisseSync(id);
    const destConnection = mysql.createConnection(destDBConfig);
    try {
        await destConnection.promise().connect();
        await destConnection.promise().query(`USE ${caisse.nomBdd}`);
        // await deleteData(destConnection, tables);
        await createDatabaseDumpReinstall(caisse.magasin.identifiant, id, tables);
        await importBdd(id, caisse.nomBdd, destDBConfig);
      await insertMiseAJourTable(destConnection, new Date(), caisse.nomBdd);

    }
    catch(err){
        console.log(err)
    }
    finally{            
        destConnection.end();
    }
}


async function createDatabaseDumpReinstall(magasin, idCaisse, tables) {
    await mysqldump({
      connection: sourceDBConfig,
      dumpToFile: `dump-caisse-${idCaisse}.sql`,
      exclude: tablesToExclude,
      dump: { 
        schema: { 
          table: { dropIfExist: true },
          format: false
        },
        data: {
          format: false,
          maxRowsPerInsertStatement: 10000,
          returnFromFunction: true,
          lockTables: false,
          where: getDataWhereDump(magasin)
        },
        trigger: false, 
        tables: tables,
        excludeTables: false, 
      },
    })
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

  
async function reinstallTable(idCaisse, idTableSynchro){
  const table = await verifierExistence(db.tableSynchro, idTableSynchro, "Table");
  await reinstallCaisse(idCaisse, [table.nom]);
}

  module.exports = {
    reinstallCaisse,
    reinstallTable
  }