const md5 = require('md5');
const { KIABI_EXTENSION, KIABI_EXTENSION_HASH, KIABI_DIRECTORY_UPLOAD } = require('../utils/constant');
const { endFtpConnection, getFtpConnection, writeFileToFTP } = require('./ftp.service');
const { insertExportSuccessHistory, insertExportErrorHistory } = require('./history.service');


async function sendFileToFtp(fileContent, filename, transaction) {
    let connection;
    try{
        connection = await getFtpConnection();
        if(!connection)
            throw new Error("Impossible de se connecter au serveur SFTP");
        await sendFileToFtpWithConnection(fileContent, filename, connection);
        await insertExportSuccessHistory(filename, KIABI_DIRECTORY_UPLOAD, transaction);
    }
    catch(err){
        await insertExportErrorHistory(filename, KIABI_DIRECTORY_UPLOAD, transaction);
        delete err.code;
        throw err;
    }
    finally{
        await endFtpConnection(connection)
    }
}

async function sendFileToFtpWithConnection(fileContent, filename, connection){
    const remotePath = getFileRemotePath(filename);
    await writeFileToFTP(connection, fileContent, remotePath);
    await sendHashFileToFtpWithConnection(fileContent, filename, connection);
}

async function sendHashFileToFtpWithConnection(fileContent, filename, connection){
    const hashFilename = generateHashFilename(filename);
    const hashFilecontent = generateHashContent(fileContent);
    const remotePath = getFileRemotePath(hashFilename);
    await writeFileToFTP(connection, hashFilecontent, remotePath);
}


function getFileRemotePath(filename){
    return `${KIABI_DIRECTORY_UPLOAD}/${filename}`;
}

function generateHashContent(content){
    const hash = md5(content);
    return hash.toString().toUpperCase();
}

function generateHashFilename(filename){
    const tmp = filename.split(".");
    return `${tmp[0]}${KIABI_EXTENSION_HASH}`;
}

module.exports = {
    sendFileToFtp
}