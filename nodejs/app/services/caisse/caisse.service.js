const { validerRequete } = require("../../helpers/form.helper");
const { verifierExistence } = require("../../helpers/helpers.helper");
const db = require("./../../models");
const { STATUS_CAISSE } = require("./env");

const Caisse = db.Caisse;
const Magasin = db.magasin;
const TableCaisse = db.tableCaisse;
const TableSynchro = db.tableSynchro;

const mysql = require('mysql2');
const net = require('net');

async function createUserCaissier (body) {
    const att = ["nom", "prenom", "username", "password", "idCaisse"];
    const nomAtt = ["Nom", "Prénom", "Nom d'utilisateur", "Mot de passe", "Caisse"];
    validerRequete(body, att, nomAtt);
    await verifierExistence(Caisse, body.idCaisse, "Caisse");
    return body;
}   
async function verifierCaisse(body, id = null){
    const att = ["adresseIp", "nomBdd", "idMagasin", "nocaisse", "usernameBdd", "passwordBdd"];
    const nomAtt = ["Adresse ip", "Nom de la base de données", "Magasin", "Numéro", "Utilisateur de la base de données", "Mot de passe de la base de données"];
    validerRequete(body, att, nomAtt);
    await verifierExistence(Magasin, body.idMagasin, "Magasin");
    await verifierNumero(body.nocaisse, body.idMagasin, id)
}

async function verifierNumero(nocaisse, idMagasin, id){
    const caisse = await Caisse.findOne({where: {nocaisse, idMagasin}});
    if(caisse && caisse.id != id){
        throw new Error("Ce numéro est déjà utilisé");
    }
}

async function createCaisse(body){
    await verifierCaisse(body);   
    body.count = 0;
    body.status = 1;
    body.connected = true;
    body.nomStatus = STATUS_CAISSE[body.status-1];
    let id;
    await db.sequelize.transaction(async (transaction)=>{
        id = (await Caisse.create(body, {transaction})).id;
        let tables = await generateTableCaisse(id);
        if(tables.length)   
            await TableCaisse.bulkCreate(tables, {transaction});
    });
    body.id = id;
    return body;
}

async function updateCaisse(id, body){
    await verifierExistence(Caisse, id, "Caisse");
    await verifierCaisse(body, id);   
    await Caisse.update(body, {where: {id}});
    return  body;
}

async function generateTableCaisse(idCaisse){
    const tables = await TableSynchro.findAll();
    const rep = [];
    for(const table of tables){
        rep.push({idCaisse, idTableSynchro: table.id, dernierModification: null});
    }
    return rep;
}

function testMySQLConnection(config) {
    return new Promise((resolve, reject) => {
      const { host, port } = config;
      // Vérifier si l'adresse IP est accessible
      const socket = net.createConnection(port, host);
      socket.on('connect', () => {
        socket.end(); 
        // Établir une connexion MySQL pour vérifier les informations d'identification
        const connection = mysql.createConnection(config);
        
        connection.connect((err) => {
        connection.end(); // Fermer la connexion MySQL après la tentative de connexion
  
        if (err) {
          reject(new Error(`Impossible de se connecter à MySQL`));
        } else {
          resolve('Connexion MySQL réussie !');
        }
      });
  
      // Gérer les erreurs de connexion en dehors de la connexion
      connection.on('error', (err) => {
        reject(new Error(`Erreur de connexion MySQL`));
      });
      }); 
      socket.on('error', (err) => {
        reject(new Error('Impossible de se connecter à l\'adresse IP et au port spécifiés.'));
      });
    });
}

async function testConnected(id){
    const caisse = await verifierExistence(Caisse, id, "Caisse");
    const config = {host: caisse.adresseIp, port: caisse.port, user: caisse.usernameBdd, password: caisse.passwordBdd};
    let connected = false;
    try{
        await testMySQLConnection(config);
        connected = true;
    }
    catch(err){}
    if(caisse.connected != connected)
        await Caisse.update({connected}, {where: {id}})
    return {connected};
}

module.exports = {
    createCaisse,
    testMySQLConnection,
    updateCaisse,
    testConnected,
    createUserCaissier
}