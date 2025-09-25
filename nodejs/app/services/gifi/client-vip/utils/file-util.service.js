const { formatDate } = require("../../../../helpers/helpers.helper");
const { Magasin } = require("../../../../models");
const { CIVILITE, FILE_CLIENT_PREFIX, FILE_CLIENT_EXT } = require("./constant");

function formatDateClient(date){
    if(!date)
        return "";
    return formatDate(date, "YYYYMMDD");
}

function formatDatetimeClient(date){
    if(!date)
        return "";
    return formatDate(date, "YYYYMMDD HH:mm:ss");
}

function getCivilite(client){
    const civilite = client.titre.toUpperCase();
    if(CIVILITE.mr.includes(civilite))
        return 1;
    if(CIVILITE.mrs.includes(civilite))
        return 2;
    return 4;
}

function substrInfo(info, length){
    if(info && info.length > length){
        return info.substring(0, length);
    }
    return info?? "";
}

function formatBoolean(value){
    if(value)
        return 1;
    return 0;
}

async function getAllMagasins() {
    return await Magasin.findAll();
}

function getClientsByMagasin(clients, magasin){
    return clients.filter((r)=> r.storeCode == magasin.storeCode);
}

function generateFilename(magasin, date){
    const storeCode = magasin.storeCode;
    date = formatDate(date, "YYMMDD");
    return `${FILE_CLIENT_PREFIX}_${storeCode}_${date}_01${FILE_CLIENT_EXT}`;
}

module.exports = {
    formatDateClient,
    formatDatetimeClient,
    getCivilite,
    substrInfo,
    formatBoolean,
    getAllMagasins,
    getClientsByMagasin,
    generateFilename
}