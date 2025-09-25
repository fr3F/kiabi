

const zoomPdf = 1;
const urlBackLocal = "http://localhost:8096/"
const URL_API = "http://192.168.2.41:8096/api/"

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


// ******************** Dev ************************
const mysqlPath = "C:/wamp64/bin/mysql/mysql5.7.31/bin/mysql";


// Cloture
const PATH_REGLEMENTS = `D:\\projet\\backup\\reglements`;
const urlLogo = urlBackLocal + "../assets/images/logo-transparent.png";
const API_LAST_FACTURE = "http://192.168.2.113:5800/lastreference/get/";
const DEVISE = "Ar";

// Configuration de la base de données source
const sourceDBConfig = {
    // host: '192.168.2.114',
    // host: "127.0.0.1",
    host: "localhost",
    user: 'root',
    password: 'Admin*25',
    database: 'kiabi',
    port: 3306,
    connectTimeout: 10000,
};

const API_SYNCHRO_SAGE = {
    update: "http://192.168.2.116:5900/synchro/update",
    init: "http://192.168.2.116:5800/synchro/init",
    stock: "http://192.168.2.116:5800/init/stock",
    cump: "http://192.168.2.116:5800/init/cump",
    numerodeserie: "http://192.168.2.116:5800/init/numerodeserie",
    emplacement: "http://192.168.2.116:5800/init/emplacement"
}

module.exports = {
    zoomPdf,
    mysqlPath,
    urlBackLocal,
    FTP_CONFIG,
    CLIENT_CONFIG,
    PATH_REGLEMENTS,
    URL_API,
    urlLogo,
    API_LAST_FACTURE,
    DEVISE,
    API_SYNCHRO_SAGE,
    sourceDBConfig,
}
