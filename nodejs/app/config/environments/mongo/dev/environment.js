// Configuration des URLs pour MongoDB et l'API REST

// Adresse IP de l'hôte (MongoDB + API REST)
// const HOST = '192.168.2.41';
const HOST = 'localhost';
// const HOST = '127.0.0.1';

// Ports respectifs
const DB_PORT = 27017;     // Port MongoDB
const API_PORT = 3000;     // Port de ton serveur Node.js/Express

// Nom de la base de données MongoDB
const DB_NAME = 'rfiddb';

// URL de connexion à la base MongoDB
const URL_DB = `mongodb://${HOST}:${DB_PORT}/${DB_NAME}`;
// Résultat : mongodb://192.168.2.41:27017/rfiddb

// URL d'accès à ton API REST
const URL_API = `http://${HOST}:${API_PORT}/api/`;
// Résultat : http://192.168.2.41:3000/api/

module.exports = {
  URL_DB,
  URL_API,
};
