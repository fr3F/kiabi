

const zoomPdf = 1;
const urlBackLocal = "http://192.168.2.108/kiabi/"
const URL_API = "http://192.168.2.108:8104/api/"
 

const FTP_CONFIG = {
    user: "ftpmadagascar",
    host: "ftps01.kiabi.fr",
    port: 990,
    password: "wKsSN5AQXITa11NTiITk"
}


const CLIENT_CONFIG = {
    storeCode: "MQ1",
    etab: "TANA1",
    origin: "CAISSE",
    type: "2",
    paysClient: "MG",
    lang: "MG",
    pays: "MG"
}

// Cloture
const PATH_REGLEMENTS = `\\\\192.168.2.253\\scan\\REGLEMENTS CAISSE`;
const urlLogo = urlBackLocal + "../assets/images/logo-transparent.png";
const API_LAST_FACTURE = "http://192.168.2.113:5800/lastreference/get/";
const DEVISE = "Ar";

// Configuration de la base de données source
const sourceDBConfig = {
    host: '192.168.2.41',
    user: 'root',
    password: 'Admin*25',
    database: 'kiabi',
    port: 3306
};

module.exports = {
    zoomPdf,
    urlBackLocal,
    FTP_CONFIG,
    CLIENT_CONFIG,
    PATH_REGLEMENTS,
    URL_API,    
    urlLogo,
    API_LAST_FACTURE,
    DEVISE,
    sourceDBConfig
}
