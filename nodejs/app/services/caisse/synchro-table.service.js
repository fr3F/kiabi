// Importation des modules et des services nécessaires
const { selectSql } = require("../../helpers/db.helper");
const { verifierExistence, dataToJson } = require("../../helpers/helpers.helper");
const { loggerSynchro } = require("../../helpers/logger");
const db = require("./../../models");
const { getSqlInsert, getConfigurationDbCaisse, pingCaisse, endConnection } = require("./util.service");
const TableSynchro = db.tableSynchro;
const Caisse = db.caisse;
const mysql = require('mysql2');

// Fonction pour mettre à jour une ligne dans les caisses
async function updateLigneCaisses(id, nomtable){
    // Vérifier l'existence de la table de synchronisation
    const tableSynchro = await verifierExistence(TableSynchro, nomtable, "Table synchro", [], null, "nom");
    // Récupérer les données à mettre à jour
    const data = await getDataUpdate(id, tableSynchro);
    // Obtenir la requête SQL d'insertion
    const {query, values} = getSqlInsert(tableSynchro, data, true);
    // Récupérer toutes les caisses
    const caisses = await getAllCaisses();
    // Exécuter la requête sur toutes les caisses
    await executeQueryCaisses(caisses, query, values, tableSynchro);
}

function updateLigneCaissesSync(id, nomtable){
    updateLigneCaisses(id, nomtable).then(
        (r)=> {},
    ).catch(err=>{console.log(err)});
}

// Fonction pour supprimer une ligne dans les caisses
async function deleteLigneCaisses(id, nomtable){
    // Vérifier l'existence de la table de synchronisation
    const tableSynchro = await verifierExistence(TableSynchro, nomtable, "Table synchro", [], null, "nom");
    // Construire la requête de suppression
    const query = `DELETE FROM ${nomtable} WHERE ${tableSynchro.nomId} = '${id}'`;
    // Récupérer toutes les caisses
    const caisses = await getAllCaisses();
    // Exécuter la requête sur toutes les caisses
    await executeQueryCaisses(caisses, query, null, tableSynchro);
}


function deleteLigneCaissesSync(id, nomtable){
    deleteLigneCaisses(id, nomtable).then(
        (r)=> {},
    ).catch(err=>{console.log(err)});
}

// Fonction pour récupérer toutes les caisses avec les informations du magasin associé
async function getAllCaisses(){
    // Récupérer toutes les caisses avec les détails du magasin associé
    let caisses = await Caisse.findAll({include: ["magasin"]});
    // Convertir les données Sequelize en format JSON
    caisses = dataToJson(caisses);
    // Ajouter la configuration de la base de données pour chaque caisse
    for(const caisse of caisses)
        caisse.dbConfig = getConfigurationDbCaisse(caisse);
    return caisses; 
}

// Fonction pour récupérer les données à mettre à jour
async function getDataUpdate(id, tableSynchro){
    const sql = `SELECT * FROM ${tableSynchro.nom} WHERE ${tableSynchro.nomId} = '${id}'`;
    const data = await selectSql(sql);
    if(!data.length)
        throw new Error("Donnée introuvable");
    return data;
}

// Fonction pour exécuter une requête sur toutes les caisses
async function executeQueryCaisses(caisses, query, values, tableSynchro){
    for(const caisse of caisses){
        // Tester si la caisse est pingable pour la synchroniser
        const ping = await pingCaisse(caisse);
        if(ping)
            await executeQueryCaisse(caisse, query, values, tableSynchro);
    }
}

// Fonction pour exécuter une requête sur une caisse spécifique
async function executeQueryCaisse(caisse, query, values, tableSynchro){
    // Créer une connexion à la base de données de la caisse
    const destConnection = mysql.createConnection(caisse.dbConfig);
    try{
        // Se connecter à la base de données
        await destConnection.promise().connect();
        // Exécuter la requête SQL avec ou sans valeurs
        if(values)
            await destConnection.promise().query(query, [values]);
        else
            await destConnection.promise().query(query);
    }
    catch(err){
        // Gérer les erreurs de synchronisation
        loggerSynchro.error(`Erreur de synchronisation pour la caisse ${caisse.nocaisse} - ${caisse.magasin.nommagasin}, ${tableSynchro.nom}`);
        loggerSynchro.error(err);
        loggerSynchro.error(err.stack);
    }
    finally{
        // Fermer la connexion à la base de données
        endConnection(destConnection);
    }
}

// Exporter les fonctions pour les utiliser ailleurs
module.exports = {
    updateLigneCaisses,
    deleteLigneCaisses,
    updateLigneCaissesSync,
    deleteLigneCaissesSync,
}
