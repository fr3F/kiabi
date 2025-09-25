// axiosInstance.js
const axios = require('axios').default;
const http = require('http');
const https = require('https');
const { loggerHttp } = require('./logger');

const axiosInstance = axios.create({
    httpAgent: new http.Agent({ keepAlive: false }),
    httpsAgent: new https.Agent({ keepAlive: false })
});


// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use((config) => {
    loggerHttp.info(`Requête envoyée : ${config.method.toUpperCase()} ${config.url}`);
    loggerHttp.info(`Données de la requête : ${JSON.stringify(config.data)}`);
    return config;
}, (error) => {
    loggerHttp.error(`Erreur lors de l'envoi de la requête : ${error.message}`);
    return Promise.reject(error);
});

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use((response) => {
    loggerHttp.info(`Réponse reçue : ${response.status} ${response.statusText} pour ${response.config.url}`);
    loggerHttp.info(`Données de la réponse : ${JSON.stringify(response.data)}`);
    return response;
}, (error) => {
    if (error.response) {
        // Le serveur a répondu avec un statut autre que 2xx
        loggerHttp.error(`Erreur de la réponse : ${error.response.status} ${error.response.statusText} pour ${error.config.url}`);
        loggerHttp.error(`Données de l'erreur : ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        loggerHttp.error(`Aucune réponse reçue pour la requête : ${error.message}`);
    } else {
        // Une erreur s'est produite lors de la configuration de la requête
        loggerHttp.error(`Erreur de requête : ${error.message}`);
    }
    return Promise.reject(error);
});

module.exports = axiosInstance;
