const { validerRequete, isDate } = require("../../../helpers/form.helper");
const helper = require("../../../helpers/helpers.helper");
const { alignColumnAndAddBorder, setHeaderResponseAttachementExcel } = require("../../../helpers/excel.helper");
const excelJS = require("exceljs"); // Pour l'export excel

const { getJsDateFromExcel } = require("excel-date-to-js");

const db = require("../../../models");
const { readListFromExcel64 } = require("../../../helpers/file.helper");
const { ErrorCode } = require("../../../helpers/error");
const { Op } = require("sequelize");
const { getNextCodeClient } = require("../../utils/dernier-numero.service");
const { getNextNumClient } = require("./utils/num-client.service");
const { setClientDateOptinOptouts } = require("./utils/optin.service");
const { addCardCreation } = require("../../../components/others/marketing/loyact/services/action.service");

const ClientVip = db.clientVip;
const ParamNumClients = db.param_num_clients
const PHONE_LENGTH = 9;

function verifierClientVip(body){
    const att = ["nom", "adresse", "ville", "titre", "telephone", "prenom", "email"];
    const nomAtt = ["Nom", "Adresse", "Ville", "Titre", "Téléphone", "Prénom", "Email"];
    validerRequete(body, att, nomAtt);
    verifyTelephoneFormat(body);
    // if(!body.dateAnniversaire)
    // throw new Error("La date d'anniversaire est obligatoire");
    if(body.dateAnniversaire && (!isDate(body.dateAnniversaire) || new Date()<new Date(body.dateAnniversaire)))
        throw new Error("Veuillez renseigner une date d'anniversaire valide");
}

function verifyTelephoneFormat(clientVip){
    if(clientVip.telephone[0] == '0')
        throw new ErrorCode("Veuillez vérifier le téléphone (doit commencer par 32,33,34,37,38)");
}

async function createClientVip(client, storeCode){
    verifyStoreCode(storeCode);
    verifierClientVip(client);
    setClientDateOptinOptouts(client);
    return await insertClientVip(client, storeCode);
}

function verifyStoreCode(storeCode){
    if(!storeCode)
        throw new ErrorCode("Veuillez renseigner le store code");
}

async function insertClientVip(client, storeCode) {
    return await db.sequelize.transaction(async (transaction)=> {
        await setFieldsAutoClient(client, storeCode, transaction);
        client = await ClientVip.create(client, { transaction });
        await addCardCreation({ noCarte: client.numClient }, transaction);
        return client; 
    });
}

async function setFieldsAutoClient(client, storeCode, transaction) {
    client.codeClient = await getNextCodeClient(transaction);
    client.numClient = await getNextNumClient(transaction);
    client.dateCreation = new Date();
    client.dateActivation = new Date();
    client.storeCode = storeCode;
}


async function updateClientVip(id, client){
    delete client.dateCreation;
    const oldClient = await helper.verifierExistence(ClientVip, id, "ClientVip");
    verifierClientVip(client);
    setClientDateOptinOptouts(client, oldClient);
    await ClientVip.update(client, {where: {id}});
    return client;
}

async function deleteClientVip(id) {
    const clientVip = await helper.verifierExistence(ClientVip, id, "ClientVip");
    await updateUtiliseParamNumClient(clientVip.numClient);
    await ClientVip.destroy({ where: { id } });
}

async function updateUtiliseParamNumClient(numClient) {
    const paramNumClient = await ParamNumClients.findOne({where: { numero: numClient }});

    if (!paramNumClient) 
        throw new ErrorCode(`Client numéro ${numClient} non trouvé`);

    // Mise à jour de la colonne "utiliser"
    await ParamNumClients.update(
        { utiliser: 0 },
        { where: { id: paramNumClient.id } }
    );
}

async function getListClientVip(req){
    let { page, limit, offset } = helper.getVarNecessairePagination(req);
    let option = getOptionGetList(req, limit, offset);
    let rep = await ClientVip.findAndCountAll(option);
    rep = helper.dataToJson(rep);
    return helper.getPagingData(rep, page, limit)
};

function getOptionGetList(req, limit, offset){
    let filters = getFiltreRecherche(req);
    let order = [
        ['point', 'DESC'],
        ['createdAt', 'DESC']
    ];
    return {
        where: filters,
        limit, offset,
        order
    };
}

function getFiltreRecherche(req){
    let filters = helper.getFiltreRecherche(req, ["numClient", "nom", "prenom", "telephone"]);
    if(!req.query.search)
        filters = {};
    return filters;
}

async function findById(id){
    let rep = await helper.verifierExistence(ClientVip, id, "Client Vip");
    return rep;
} 

// Export excel
const COLONNES_EXCEL = [
    {header: "Numéro", key: "numClient", width: 15},        
    {header: "Nom", key: "nom", width: 40},        
    {header: "Prénom", key: "prenom", width: 40},        
    {header: "Adresse", key: "adresse", width: 40},        
    // {header: "Code ville", key: "code", width: 10},        
    {header: "Ville", key: "ville", width: 20},        
    {header: "Téléphone", key: "telephone", width: 15},        
    {header: "Titre", key: "titre", width: 15},        
    // {header: "Adresse 2", key: "adresse2", width: 15},        
    {header: "Email", key: "email", width: 20},        
    {header: "Date de création", key: "dateCreation", width: 16},        
    // {header: "Portable", key: "portable", width: 15},        
    {header: "Date d'anniversaire", key: "dateAnniversaire", width: 17},        
    {header: "Date modification", key: "dateModification", width: 16},        
    {header: "Dernier achat", key: "dernierAchat", width: 16},        
    {header: "Point", key: "point", width: 10},        
]

async function exporterExcelClientVIP(res){
    const clients = helper.dataToJson(await ClientVip.findAll());
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Client VIP"); // New Worksheet
    worksheet.columns = COLONNES_EXCEL;
    clients.forEach((item)=>{
        formatClientVipExcel(item);
        worksheet.addRow(item);
    })
    worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
    alignColumnAndAddBorder(worksheet)
    setHeaderResponseAttachementExcel(res, `Virement.xlsx`);
    workbook.xlsx.writeBuffer({useStyles: true}).then((r)=>{
        res.send(r)
    }) 
}


function formatClientVipExcel(item){
    for(const col of COLONNES_EXCEL){
        if(!item[col.key] && item[col.key] !== 0) item[col.key] = "";
    }
    const formatDate = "DD-MM-YYYY";
    const formatDatetime = "DD-MM-YYYY HH:mm";
    item.dateCreation = item.dateCreation? helper.formatDate(item.dateCreation, formatDate): "";
    item.dateAnniversaire = item.dateAnniversaire? helper.formatDate(item.dateAnniversaire, formatDate): "";
    item.dateModification = item.dateModification? helper.formatDate(item.dateModification, formatDatetime): "";
    item.dernierAchat = item.dernierAchat? helper.formatDate(item.dernierAchat, formatDatetime): "";
}

/// Importer client VIP à partir d'un fichier excel(fichier excel idem export) 
async function importClientVIPExcel(file, storeCode){
    const {list, numClients} = getListFileExcel(file, storeCode);
    // Colonne à mettre à jour
    const columns = ["nom", "prenom", "adresse", "ville", "telephone", "titre",
        "email",  "dateModification", "dateAnniversaire"        
    ] 
    // await verifyNumClientExistant(numClients);
    await ClientVip.bulkCreate(list, {updateOnDuplicate: columns});
}


async function verifyNumClientExistant(numClients){
    const clientExistant = await ClientVip.findAll({where: {numClient: {[Op.in]: numClients}}});
    if(clientExistant.length){
        const nums = clientExistant.map((r)=> r.numClient).join(' - ');
        throw new ErrorCode("Numéros dupliqués : " + nums);
    }
}

function verifierClientVipExcel(body){
    const att = ["numClient", "nom", "telephone"];
    const nomAtt = ["Numéro client", "Nom", "Téléphone"];
    validerRequete(body, att, nomAtt);
    if(body.dateAnniversaire && (!isDate(body.dateAnniversaire) || new Date()<new Date(body.dateAnniversaire)))
        throw new Error("Veuillez renseigner une date d'anniversaire valide");
}

function getListFileExcel(file, storeCode){
    if(!file)
        throw new Error("Veuillez renseigner le fichier");
    const list = readListFromExcel64(file);
    if(!list.length)
        throw new ErrorCode("Veuillez renseigner une liste non vide");
    const resp = [];
    const numClients = [];
    for(const item of list){
        const client = generateClientFromExcel(item, storeCode);
        verifierClientVipExcel(client);
        resp.push(client);
        verifyTelephone(client);
        numClients.push(client.numClient);
    }   
    return {list: resp, numClients};
}

function verifyTelephone(client){
    if(!client.telephone || client.telephone.toString().length != PHONE_LENGTH)
        throw new ErrorCode(`Téléphone invalide pour le client ${client.numClient}`);
}

function generateClientFromExcel(item, storeCode){
    const resp = {storeCode};
    for(const col of COLONNES_EXCEL){
        resp[col.key] = item[col.header];
    }
    resp.dateCreation = new Date();
    resp.dateModification = new Date();
    resp.dateAnniversaire = resp.dateAnniversaire? getJsDateFromExcel(resp.dateAnniversaire): null;
    return resp;
}

module.exports = {
    createClientVip,
    getListClientVip,
    findById,
    updateClientVip,
    deleteClientVip,
    exporterExcelClientVIP,
    importClientVIPExcel
}