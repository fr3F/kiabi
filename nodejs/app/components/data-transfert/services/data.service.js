const { formatDate, readFile } = require("../../../helpers/helpers.helper");
const { loggerGlobal } = require("../../../helpers/logger");
const { sequelize } = require("../../../models");
const { KIABI_DIRECTORIES, KIABI_EXTENSION, KIABI_BACKUP_PATH, KIABI_SEPARATOR, KIABI_DIRECTORY_ARCHIVES } = require("../utils/constant");
const { KIABI_DATATYPE } = require("../utils/fileConstant");
const { updateDataWithItems } = require("./data-item.service");
const { getFtpConnection, endFtpConnection, listRemoteFilesFromPath, copyFileFromFTP, deplaceFileFTP } = require("./ftp.service");
const { insertDownloadErrorHistory, insertDownloadSuccessHistory, insertImportErrorHistory, insertImportSuccessHistory } = require("./history.service");
const fs = require("fs");
const { getLinesFromContent, generateDataFromLine } = require("./util.service");
const { Op } = require("sequelize");

async function initDataFromFtp() {
    await updateAllDataFromFtp(true);
}

function updateAllDataFromFtpSync(){
    updateAllDataFromFtp(false).then(
        (r)=>{
            loggerGlobal.info("Mise à jour data FTP")
        }
    ).catch((err)=>{
        loggerGlobal.error("Mise à jour data FTP")
        loggerGlobal.error(err)
        loggerGlobal.error(err.stack)
    })
}

async function updateAllDataFromFtp(isInitialization = false) {
    const localPath = getStockDirName();
    await downloadAllFiles(localPath);
    const filesToDeplaces = await updateAllData(isInitialization);
    await deplaceFilesToArchives(filesToDeplaces);
}


async function downloadAllFiles(localPath) {
    let connection;
    try{
        connection = await getFtpConnection();
        if(!connection)
            throw new Error("Impossible de se connecter au serveur SFTP");
        await downloadAllFilesWithConnection(localPath, connection);
    }
    catch(err){
        delete err.code;
        throw err;
    }
    finally{
        await endFtpConnection(connection)
    }
}

async function downloadAllFilesWithConnection(localPath, connection) {
    for(const directory of KIABI_DIRECTORIES){
        await downloadFilesForDirectory(directory, localPath, connection);
    }    
}

async function downloadFilesForDirectory(directory, localPath, connection) {
    const existingFiles = await listRemoteFilesFromPath(connection, directory.path);
    directory.existingFiles = existingFiles;
    localPath += directory.path;
    directory.localPath = localPath;
    createDirIfNotExist(directory.localPath);
    for(const file of existingFiles){
        await downloadFile(directory, file, connection);
    }
}

async function downloadFile(directory, file, connection) {
    try{
        const remotePath = directory.path + "/" + file;
        const localPath = directory.localPath + "/" + file;
        await copyFileFromFTP(connection, remotePath, localPath);
        await insertDownloadSuccessHistory(file, directory);
    }
    catch(err){
        await insertDownloadErrorHistory(file, directory);
        throw err;
    }
}

async function updateAllData(isInitialization) {
    const filesToDeplace = []
    for(const directory of KIABI_DIRECTORIES){
        await updateDataForDirectory(directory, isInitialization, filesToDeplace);
    }
    return filesToDeplace;
}

async function updateDataForDirectory(directory, isInitialization, filesToDeplace) {
    const existingFiles = directory.existingFiles;
    const filesList = [];
    for(const file of directory.items){
        await updateDataForItem(file, directory, existingFiles, isInitialization, filesList);
    }
    filesToDeplace.push({ path: directory.path, files: filesList });
}

async function updateDataForItem(item, directory, existingFiles, isInitialization, filesToDeplace) {
    await initializeTable(item, isInitialization);
    const files = findCorrespondingFiles(existingFiles, item);
    for(const file of files){
        await updateDataFromFile(item, file, directory, filesToDeplace);
    }
}

async function initializeTable(item, isInitialization) {
    if(isInitialization){
        await sequelize.transaction(async (transaction)=>{
            if(item.itemModel)
                await item.itemModel.truncate({transaction});
            await item.model.destroy({
                where: {id: {[Op.not]: null}}
            },{transaction});
        })
    }
}

function findCorrespondingFiles(existingFiles, file){
    return existingFiles.filter((f)=>{
        const name = f.toUpperCase();
        return name.startsWith(file.prefix) && name.endsWith(KIABI_EXTENSION);
    })   
}

async function updateDataFromFile(item, filename, directory, filesToDeplace) {
    try{
        const localPath = directory.localPath;
        const fileContent = getFileContent(filename, localPath);
        if(!item.itemModel)
            await updateDataWithoutItem(item, filename, directory, fileContent);
        else
            await updateDataWithItems(item, filename, directory, fileContent);
        filesToDeplace.push(filename);
    }
    catch(err){
        console.log(err);
        await insertImportErrorHistory(item, filename, directory);
    }
}

async function updateDataWithoutItem(item, filename, directory, fileContent) {
    const data = generateDataListFromContent(fileContent, item);
    await insertData(item, filename, directory, data)
}

function getFileContent(file, localPath) {
    localPath = localPath + "/" + file;
    return readFile(localPath);
}

function getStockDirName(){
    const date = formatDate(new Date(), "YYYYMMDD-HH");
    let path = `${__basedir}/${KIABI_BACKUP_PATH}`; 
    createDirIfNotExist(path);
    path += `/${date}`;
    createDirIfNotExist(path);
    return path + "/";
}

function createDirIfNotExist(path){
    if(!fs.existsSync(path))
        fs.mkdirSync(path);
}

function generateDataListFromContent(content, item){
    const resp = [];
    const lines = getLinesFromContent(content);
    for(let i = 0; i < lines.length; i++){
        const tmp = generateDataFromLine(lines[i], item.columns);
        resp.push(tmp);
    }
    return resp;
}

async function insertData(item, filename, directory, data) {
    const updateOnDuplicate = getColumnToUpdate(item);
    await sequelize.transaction(async (transaction)=>{
        if(data.length)
            await item.model.bulkCreate(data, { transaction, updateOnDuplicate });
        await insertImportSuccessHistory(item, filename, directory, transaction);
    })
}

function getColumnToUpdate(item){
    return item.columns.map((r)=> r.name);
}


async function deplaceFilesToArchives(files) {
    let connection;
    try{
        connection = await getFtpConnection();
        if(!connection)
            throw new Error("Impossible de se connecter au serveur SFTP");
        await deplaceFilesWithConnection(files, connection);
    }
    catch(err){
        delete err.code;
        throw err;
    }
    finally{
        await endFtpConnection(connection)
    }
}

async function deplaceFilesWithConnection(directories, connection){
    for(const directory of directories){
        await deplaceDirectoryFiles(directory, connection);
    }
}

async function deplaceDirectoryFiles(directory, connection) {
    for(const file of directory.files){
        const newPath = `${KIABI_DIRECTORY_ARCHIVES}${directory.path}/${file}`;
        const oldPath = `${directory.path}/${file}`;
        await deplaceFileFTP(connection, oldPath, newPath);
    }       
}


module.exports = {
    updateAllDataFromFtp,
    initDataFromFtp,
    updateAllDataFromFtpSync
}