const fs = require("fs");  /// pour lire et ecrire dans un fichier 
const { Op } = require("sequelize");
const dayjs = require("dayjs")
const locale_fr = require('dayjs/locale/fr');
const { ErrorCode } = require("./error");
const { loggerError } = require("./logger");
dayjs.locale(locale_fr);
// dayjs.locale('fr') // use loaded locale globally

// Envoyer message d'erreur
function sendErrorMessage(res, message, status = 500){
    loggerError.error(message);
    res.status(status).send({message: message});
}


// Envoyer erreur
function sendError(res, err, status = 500){
    if(err.code)
        status = err.code;
    console.log(err);
    loggerError.error(err);
    loggerError.error(err.stack);
    res.status(status).send({message: err.message});
}

// Obtenir limit et offset
function getPagination(page, size){
    // size = size? size: 10;
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};


// Obtenir un data avec pagination 
function getPagingData(data, page, limit, nomLigne = "data"){
    const { count: totalItems, rows: products } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    let rep = { totalItems, totalPages, currentPage };
    rep[nomLigne] = products;
    return rep; 
};

// Uploader un fichier base64 vers le serveur
function uploadFile(content, path){
    let writeStream = fs.createWriteStream(path);
    let base64result = content.substr(content.indexOf(',') + 1);
    // write some data with a base64 encoding
    writeStream.write(base64result, 'base64');
    writeStream.on('finish', () => {
        console.log('wrote all data to file');
    });

    // 'error' event: emitted if an error occurs during the writing process
    writeStream.on('error', (err) => {
        console.error('Error writing data:', err);
    });
    writeStream.end();
}

function uploadFileAsync(content, path) {
    return new Promise((resolve, reject) => {
      let writeStream = fs.createWriteStream(path);
      let base64result = content.substr(content.indexOf(',') + 1);
  
      // 'error' event: emitted if an error occurs during the writing process
      writeStream.on('error', (err) => {
        console.error('Error writing data:', err);
        reject(err); // Rejeter la promesse en cas d'erreur
      });
  
      // 'finish' event: emitted when the writing is complete
      writeStream.on('finish', () => {
        console.log('wrote all data to file');
        resolve(); // Résoudre la promesse lorsque l'écriture est terminée
      });
  
      // write some data with a base64 encoding
      writeStream.write(base64result, 'base64');
      writeStream.end();
    });
  }
  
// lire dans un fichier
function readFile(path){
    let data = fs.readFileSync(path, {encoding:'utf8', flag:'r'});
    return data
}

// Recuperer les variables necessaires pour la pagination
function getVarNecessairePagination(req){
    let { page, size } = req.query;
    page = page? page: 0;
    size = size? size: 10;
    const { limit, offset } = getPagination(page, size);
    return {page, size, limit, offset};
}


// generer condition pour la recherche
function getFiltreRecherche(req, fields = ["designation"]){
    let filters = {};
    const searchQuery = req.query.search? req.query.search.trim(): '';
    const value = { [Op.like]: `%${searchQuery}%` };
    fields.forEach((item) => (filters[item] = value));
    return {[Op.or]: filters};
}

function dataToJson(data){
    return JSON.parse(JSON.stringify(data));
}


// Verifier si la ligne existe(retourner si existe)
async function verifierExistence(model ,id, nom="", include = [], transaction = null, nomId = "id", order = []){
    if(!id)
        throw new ErrorCode("Veuillez renseigner l'identifiant" + (nom? ` du "${nom}"`: ""))
    let t
    if(nomId == id)
        t = await model.findByPk(id, {include, transaction});
    else{
        let cond = {}
        cond[nomId] = id;
        t = await model.findOne({where: cond, include, transaction, order});
    }
    if(!t)
        throw new ErrorCode(nom + " introuvable")
    return dataToJson(t);
}

// ecrire dans un fichier et remplacer si existe
function ecrireFichier(path, content, encoding = 'utf8'){
    fs.writeFile(path, content, {encoding}, (err)=>{
        if(err){
            console.log(err);
            return;
        }
    })
}

// ecrire dans un fichier et remplacer si existe
function ecrireFichierSync(path, content, encoding = 'utf8'){
    fs.writeFileSync(path, content, {encoding});
}

// Recuperer un tableau de valeur d'un attribut d'un tableau
function getValeurAttribut(attribut, tab){
    let rep = [];
    for(let i = 0; i < tab.length; i++){
        rep.push(tab[i][attribut])
    }
    return rep;
}

// formater date
function formatDate(date, format = "DD/MM/YYYY"){
    return dayjs(date).format(format);
}

// src: objet source, dest: objet de destination, att: attributs à copier
function copierValeurAttribut(src, dest, att){
    for(let i = 0; i<att.length; i++){
        dest[att[i]] = src[att[i]]
    }
}


// Verifier attribut unique
async function verifierAttributUnique(model, value, id = "", colonne = "designation", nom="Désignation"){
    // let t1 = await
    let cond = {}
    cond[colonne] = value
    let t = await model.findOne({where: cond});
    if(t && t.id != id)
        throw new Error(nom + " déjà utilisé(e)")
}


// Modifier header reponse attachement
function setHeaderResponseAttachementPdf(res, filename){
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename + ";"
    );
}

// Formater un entier
function formatEntier(nombre){
    return new Intl.NumberFormat().format(nombre)
}

function regroupByAttribut(items, attribute){
    let rep = [];
    let indice = -1;
    let value = undefined;
    for(let item of items){
        if(item[attribute] != value){
            value = item[attribute];
            indice ++;
            const tmp = {items: []}
            tmp[attribute] = value;
            rep.push(tmp);
        }
        rep[indice].items.push(item);
    }
    return rep;
}



// Formatter nb
function formaterNb(nombre, fixed = 4, sep = "."){
    if(nombre == '' || !nombre)
        nombre = 0;
    return parseFloat(nombre).toFixed(fixed).replace(".", sep);
}


function replaceAll(str, old, newValue){
    const regex = new RegExp(old, 'g');
    return str.replace(regex, newValue);
}



function validerEmail(variable) {
    if (typeof variable !== 'string') throw new Error("Veuillez renseigner l'email");

    const emails = variable.split(';').map(email => email.trim());

    if (emails.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        throw new Error('Au moins un email n\'est pas valide');
    }

    return true;
}

function removeLeadingZeros(str) {
    if(!str)
        return "";
    return str.toString().replace(/^0+/, '');
}

function estNombreFr(chaine) {
    // Regex pour matcher les nombres français
    const pattern = /^-?\d{1,3}(?: \d{3})*(?:,\d+)?$/;

    if (pattern.test(chaine)) {
        try {
            // Remplacer les espaces par rien et les virgules par des points pour la conversion float
            const nombre = parseFloat(chaine.replace(/ /g, '').replace(/,/g, '.'));
            return !isNaN(nombre);
        } catch (e) {
            return false;
        }
    }
    return false;
}

function toUpperCaseComparaison(str){
    if(!str)
        return "";
    return str.toString().toUpperCase().trim();
}

function trimStr(str){
    if(!str)
        return "";
    return str.toString().trim();
}


function isNumber(value){
    if (typeof value === 'string') {
      value = value.replace(/\s+/g, ''); // Supprime tous les espaces
    }
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function roundNbTo(n, decimals) {
    return Number(n.toFixed(decimals));
}

module.exports  = {
    sendError,
    getPagination,
    getPagingData,
    sendErrorMessage,
    uploadFile,
    readFile,
    getVarNecessairePagination,
    getFiltreRecherche,
    dataToJson,
    verifierExistence,
    ecrireFichier,
    getValeurAttribut,
    formatDate,
    copierValeurAttribut,
    verifierAttributUnique,
    setHeaderResponseAttachementPdf,
    formatEntier,
    regroupByAttribut,
    formaterNb,
    uploadFileAsync,
    replaceAll,
    validerEmail,
    ecrireFichierSync,
    removeLeadingZeros,
    estNombreFr,
    toUpperCaseComparaison,
    trimStr,
    isNumber,
    roundNbTo
}