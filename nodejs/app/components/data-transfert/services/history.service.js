const { dataToJson, getPagingData, getVarNecessairePagination, getFiltreRecherche } = require("../../../helpers/helpers.helper");
const { DataHistory } = require("../../../models");

const HistoryStatus = {
    ok: "OK",
    ko: "KO"
}

const HistoryType = {
    download: "Téléchargement",
    import: "Import",
    export: "Envoi"
}

async function insertDownloadErrorHistory(filename, directory) {
    const history = generateHistory({}, filename, directory, HistoryStatus.ko, HistoryType.download);
    await insertHistory(history)
}

async function insertDownloadSuccessHistory(filename, directory) {
    const history = generateHistory({}, filename, directory, HistoryStatus.ok, HistoryType.download);
    await insertHistory(history)
}

async function insertImportErrorHistory(item, filename, directory) {
    const history = generateHistory(item, filename, directory, HistoryStatus.ko, HistoryType.import);
    await insertHistory(history)
}

async function insertImportSuccessHistory(item, filename, directory, transaction) {
    const history = generateHistory(item, filename, directory, HistoryStatus.ok, HistoryType.import);
    await insertHistory(history, transaction)
}

function generateHistory(item, filename, directory, status, type){
    return {
        folder: directory.name,
        designation: item.name,
        file: filename,
        status,
        type
    }
}

async function insertHistory(history, transaction){
    await DataHistory.create(history, { transaction });
}

async function insertExportSuccessHistory(file, folder, transaction) {
    const history = generateHistoryExport(file, folder, HistoryStatus.ok);
    await insertHistory(history, transaction);
}

async function insertExportErrorHistory(file, folder, transaction) {
    const history = generateHistoryExport(file, folder, HistoryStatus.ko);
    await insertHistory(history, transaction);
}

function generateHistoryExport(file, folder, status){
    const designation = getDesignationExport(file);
    folder = folder.replaceAll("/", "");
    return {
        file,
        folder,
        designation,
        status,
        type: HistoryType.export
    }
}

function getDesignationExport(file){
    return file.split("_")[0];
}


// List with pagination, and criteria
async function getListHistories(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    let option = getOptionGetHistory(req, limit, offset);
    let rep = await DataHistory.findAndCountAll(option);
    rep = dataToJson(rep);
    return getPagingData(rep, page, limit)
};

function getOptionGetHistory(req, limit, offset){
    let filters = getFiltreRechercheHistory(req);
    let order = [['createdAt', 'DESC']];
    return {
        where: filters,
        limit, offset,
        order
    };
}

function getFiltreRechercheHistory(req){
    let filters = getFiltreRecherche(req, ["folder", "designation", "file"]);
    if(!req.query.search)
        filters = {};
    return filters;
}


module.exports = {
    insertDownloadErrorHistory,
    insertDownloadSuccessHistory,
    insertImportErrorHistory,
    insertImportSuccessHistory,
    getListHistories,
    insertExportSuccessHistory,
    insertExportErrorHistory
}