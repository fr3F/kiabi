const { formatDate, ecrireFichier } = require("../../../helpers/helpers.helper");
const fs = require("fs");
const { KIABI_BACKUP_PATH, KIABI_UPLOAD_ENCODING } = require("../utils/constant");
const path = require('path');


function addFileToBackup(filename, content){
    filename = path.basename(filename);
    const filepath = getStockDirName() + filename;
    ecrireFichier(filepath, content, KIABI_UPLOAD_ENCODING);
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
        fs.mkdirSync(path, { recursive: true });
}

module.exports = {
    addFileToBackup
}