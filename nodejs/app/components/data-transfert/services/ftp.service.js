const ftp = require("basic-ftp");
const { FTP_CONFIG } = require("../../../config/environments/mysql/environment");
const { uploadFile, ecrireFichier } = require("../../../helpers/helpers.helper");
const { Readable } = require("stream");
const { loggerGlobal } = require("../../../helpers/logger");
const { KIABI_EXTENSION, KIABI_EXTENSION_HASH } = require("../utils/constant");
const { addFileToBackup } = require("./backup.service");

async function getFtpConnection() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Active les logs
    client.ftp.log = (message) => loggerGlobal.info(message);
    try {
        await client.access({
            host: FTP_CONFIG.host,
            user: FTP_CONFIG.user,
            password: FTP_CONFIG.password,
            secure: true,
            port: FTP_CONFIG.port || 990, // Utilise le port 990 par défaut si non défini
        });

        console.log("Connexion FTPS réussie !");
        return client;
    } catch (error) {
        console.error("Erreur de connexion FTPS :", error.message);
        client.close();
        throw error;
    }
}

async function listRemoteFilesFromPath(client, remotePath) {
    try {
        const remoteFiles = await client.list(remotePath);
        return remoteFiles.map(file => file.name);
    } catch (error) {
        console.error("Erreur lors de la récupération des fichiers FTP :", error.message);
        throw error;
    }
}

async function copyFileFromFTP(client, remoteFilePath, localPath) {
    try {
        await client.downloadTo(localPath, remoteFilePath);
        console.log(`Fichier copié avec succès de ${remoteFilePath} vers ${localPath}`);
    } catch (err) {
        console.error(`Erreur lors de la copie du fichier : ${err.message}`);
        throw err;
    }
}

async function endFtpConnection(client) {
    if (client) {
        await client.close();
        console.log("Connexion FTPS fermée.");
    }
}

async function writeFileToFTP(client, fileContent, remoteFilePath) {
    try {
        addFileToBackup(remoteFilePath, fileContent);
        const buffer = Buffer.from(fileContent);
        const stream = Readable.from(buffer);
        await client.uploadFrom(stream, remoteFilePath);
        console.log(`Fichier copié avec succès vers  ${remoteFilePath}`);
    } catch (err) {
        console.error(`Erreur lors de la copie du fichier : ${err.message}`);
        throw err;
    }
}

async function deplaceFileFTP(client, oldPath, newPath) {
    try {
        await client.rename(oldPath, newPath);
        await deplaceHashFile(client, oldPath, newPath);
        console.log(`Fichier deplacé avec succès de ${oldPath} vers ${newPath}`);
    } catch (err) {
        console.error(`Erreur lors de la copie du fichier : ${err.message}`);
        throw err;
    }
}

async function deplaceHashFile(client, oldPath, newPath) {
    try{
        oldPath = oldPath.replace(KIABI_EXTENSION, KIABI_EXTENSION_HASH);
        newPath = newPath.replace(KIABI_EXTENSION, KIABI_EXTENSION_HASH);
        await client.rename(oldPath, newPath);    
    }
    catch(err){
        console.error(err);
    }

}

module.exports = {
    getFtpConnection,
    endFtpConnection,
    listRemoteFilesFromPath,
    copyFileFromFTP,
    writeFileToFTP,
    deplaceFileFTP
};
