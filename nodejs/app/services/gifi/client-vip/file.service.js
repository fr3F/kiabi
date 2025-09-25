const { Op } = require("sequelize");
const { sendFileToFtp } = require("../../../components/data-transfert/services/upload.service");
const { CLIENT_CONFIG } = require("../../../config/environments/mysql/dev/environment");
const { formatDate } = require("../../../helpers/helpers.helper");
const { loggerGlobal, loggerError } = require("../../../helpers/logger");
const { clientVip: ClientVip, sequelize } = require("../../../models");
const { FILE_HEADER, FIELDS_LENGTH, FILE_CLIENT_SEPARATOR, ENCRIPTION_KEY_PATH } = require("./utils/constant");
const { formatDatetimeClient, getCivilite, substrInfo, formatBoolean, formatDateClient, getAllMagasins, getClientsByMagasin, generateFilename } = require("./utils/file-util.service");
const { encryptWithGPG } = require("./utils/encrypt.service");

function sendClientFileSync(){
    sendClientFile().then(()=>{
        loggerGlobal.info("Client KIABI sent")
    }).catch(
        (err)=>{
            loggerError.error("Client KIABI");
            loggerError.error(err.message);
            loggerError.error(err.stack);
        }
    )
}

async function sendClientFile() {
    const date = new Date();
    return await sendClientFileByDate(date);
}

async function sendClientFileByDate(date) {
    const magasins = await getAllMagasins();
    const clients = await getClientsToExport(date);
    for(const magasin of magasins){
        await sendClientFileByMagasin(clients, magasin, date);
    }
}

async function sendClientFileByMagasin(clients, magasin, date) {
    clients = getClientsByMagasin(clients, magasin);
    const filename = generateFilename(magasin, date);
    const fileContent = exportClientFileByList(clients);
    const bufferContent = Buffer.from(fileContent, 'utf8');
    const contentEncrypted = await encryptWithGPG(ENCRIPTION_KEY_PATH, bufferContent);
    await sendFileToFtp(contentEncrypted, filename);
}

function exportClientFileByList(clients){
    let lines = [FILE_HEADER];
    lines = lines.concat(generateLinesClient(clients));
    return lines.join(FILE_CLIENT_SEPARATOR.line);
}


async function getClientsToExport(date){
    date = formatDate(date, "YYYY-MM-DD");
    return await ClientVip.findAll({
        where: {[Op.and]: [
            sequelize.where(sequelize.fn('DATE', sequelize.col('dateModification')), date)
        ]},
    });
}

function generateLinesClient(clients) {
    const lines = [];
    for(const client of clients){
        lines.push(generateLineClient(client))
    }
    return lines;
}

function generateLineClient(client){
    const fields = [];
    addMandatoryFields(client, fields);
    addCustomerInfo(client, fields);
    addAddressInfo(client, fields);
    addDeliveryAddressInfo(client, fields);
    addLandlinePhone(client, fields);
    addMobilePhone(client, fields);
    addEmail(client, fields);
    addOptinOptout(client, fields);
    addDateOfBirth(client, fields);
    addChildrenInfo(client, fields);
    addActionDate(client, fields);
    addDeletionRequest(client, fields);
    return fields.join(FILE_CLIENT_SEPARATOR.column);
}

function addMandatoryFields(client, fields){
    fields.push(client.codeClient);
    fields.push(client.numClient);
    addActionDate(client, fields);
    fields.push(client.storeCode);
    fields.push(CLIENT_CONFIG.etab);
    fields.push(client.storeCode);
    fields.push(CLIENT_CONFIG.etab);
    fields.push(CLIENT_CONFIG.origin);
    fields.push(CLIENT_CONFIG.type);
}

function addCustomerInfo(client, fields){
    fields.push(getCivilite(client));
    fields.push(substrInfo(client.nom, FIELDS_LENGTH.nom));
    fields.push("");
    fields.push(substrInfo(client.prenom, FIELDS_LENGTH.prenom));
    fields.push("");
    fields.push(CLIENT_CONFIG.paysClient);
    fields.push(CLIENT_CONFIG.lang);
    fields.push("");
}

function addAddressInfo(client, fields){
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push(substrInfo(client.code, FIELDS_LENGTH.zipCode));
    fields.push(substrInfo(client.ville, FIELDS_LENGTH.city));
    fields.push(CLIENT_CONFIG.pays);
    fields.push("");
    addDateAndFlag(client, fields);
}

function addDeliveryAddressInfo(client, fields){
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push(0);
}

function addLandlinePhone(client, fields){
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push(0);
}

function addMobilePhone(client, fields){
    fields.push(substrInfo(client.telephone, FIELDS_LENGTH.phone));
    addDateAndFlag(client, fields);
}

function addEmail(client, fields){
    fields.push(substrInfo(client.email, FIELDS_LENGTH.email));
    addDateAndFlag(client, fields);
}

function addOptinOptout(client, fields){
    addOptinOptoutGeneric(client, fields, "Sms");
    addOptinOptoutGeneric(client, fields, "Email");
}

function addOptinOptoutGeneric(client, fields, columnName){
    fields.push(formatBoolean(client[`optin${columnName}Kiabi`]));    
    fields.push(formatDatetimeClient(client[`dateOptin${columnName}Kiabi`]));
    fields.push(formatDatetimeClient(client[`dateOptout${columnName}Kiabi`]));
    fields.push(formatBoolean(client[`optin${columnName}Partner`]));    
    fields.push(formatDatetimeClient(client[`dateOptin${columnName}Partner`]));
    fields.push(formatDatetimeClient(client[`dateOptout${columnName}Partner`]));
}

function addDateOfBirth(client, fields){
    fields.push(formatDateClient(client.dateAnniversaire));
}

function addChildrenInfo(client, fields){
    for(let i = 0; i < FIELDS_LENGTH.children; i++){
        addChildInfo(fields);
    }
}

function addChildInfo(fields){
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push("");
    fields.push(0);
}

function addDeletionRequest(client, fields){
    fields.push(0);
    fields.push(0);
}

function addDateAndFlag(client, fields){
    addActionDate(client, fields);
    fields.push(0);
}

function addActionDate(client, fields){
    fields.push(formatDatetimeClient(client.dateCreation));
    fields.push(formatDatetimeClient(client.dateModification));
}

module.exports = {
    sendClientFile,
    sendClientFileSync
}