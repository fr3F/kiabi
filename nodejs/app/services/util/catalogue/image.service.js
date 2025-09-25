const { siteSodimDBConfig, urlImageSodim } = require("../../../config/environments/mysql/environment");
const { verifierExistence, dataToJson } = require("../../../helpers/helpers.helper");
const { endConnection } = require("../../caisse/util.service");
const db = require("./../../../models");
const Catalogues = db.catalogue; 
const Magasin = db.magasin; 
const mysql2 = require('mysql2');
const fs = require("fs");
const { copierImageUrl } = require("../../../helpers/file.helper");

async function checkImageMagasin(idMagasin){
    const magasin = await verifierExistence(Magasin, idMagasin, "Magasin");
    const catalogues = dataToJson(await Catalogues.findAll({where: {magasin: magasin.nommagasin}}));
    if(!catalogues.length)  
        return;
    const images = await getImagesCatalogues(catalogues);
    const path = getPathImages(magasin) + "/";
    copyImagesCatalogues(catalogues, images, path);
    await db.sequelize.transaction(async (transaction)=>{
        await updateCatalogues(catalogues, transaction);
    })
    return images;
}

function getPathImages(magasin){
    let path = `${global.__basedir}/files/catalogues/${magasin.identifiant}`; 
    if(!fs.existsSync(path))
        fs.mkdirSync(path);
    return path;
}



async function updateCatalogues(catalogues, transaction){
    const batchSize = 5000;
    const totalCatalogues = catalogues.length;

    for (let i = 0; i < totalCatalogues; i += batchSize) {
        const cataloguesSlice = catalogues.slice(i, i + batchSize);
        if (cataloguesSlice.length > 0) {
            await Catalogues.bulkCreate(cataloguesSlice, { transaction, updateOnDuplicate: ["avecImage"] });
        }
    }
}

function copyImagesCatalogues(catalogues, images, path){
    for(const catalogue of catalogues){
        const imagesCatalogues = images.filter((r)=> r.code == catalogue.code);
        catalogue.avecImage = imagesCatalogues.length > 0;        
        copyImagesCatalogue(catalogue, imagesCatalogues, path)
    }
}

function copyImagesCatalogue(catalogue, images, path){
    for(let i = 0; i < images.length; i++){
        const remotePath = urlImageSodim + images[i].image;
        const localPath = `${path}${catalogue.code}_${i+1}.png`;
        copierImageUrl(remotePath, localPath).then().catch((err)=>{})
    }
}

async function getImagesCatalogues(catalogues){
    const sql = getSqlImagesCatalogues(catalogues);
    let connection = null;
    try{
            connection = mysql2.createConnection(siteSodimDBConfig);
            await connection.promise().connect();
            return await getDataByConnection(connection, sql);
    }
    catch(err){
        console.log(err)
        throw new Error("Une erreur s'est produite lors de la récupération des données")
    }
    finally{
        endConnection(connection);
    }
}


async function getDataByConnection(connection, sql){
    const res = await connection.promise().query(sql);
    return  res[0];
}

function getSqlImagesCatalogues(catalogues){
    const codes = catalogues.map((r)=> `'${r.code}'`);
    const condition = codes.join(", ");
    const sql = `SELECT i.name image, code
                    FROM images i
                        JOIN products p ON(p.id = i.productId)
                    WHERE code IN(${condition})`;
    return sql;
}


module.exports = {
    checkImageMagasin
}