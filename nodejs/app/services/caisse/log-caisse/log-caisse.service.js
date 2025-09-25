const { Op } = require("sequelize");
const { dataToJson, } = require("../../../helpers/helpers.helper");
const db = require("../../../models");
const { verifyDate, getConditionDate } = require("./util.service");

const LogCaisse = db.logCaisse;
const sequelize = db.sequelize;

/**
 * Récupère les logs de caisse regroupés par message pour une date donnée.
 * @param {string} date - La date pour laquelle les logs sont récupérés.
 * @param {Object} user - L'utilisateur pour appliquer des filtres supplémentaires.
 * @returns {Promise<Array>} - Un tableau d'objets contenant les messages et leur nombre.
 */
async function getLogCaisseGrouped(date, user) {
    date = verifyDate(date);
    const where =  {
        [Op.and]: [
            sequelize.where(sequelize.fn('DATE', sequelize.col('timestamp')), date)
        ]
    };
    await addFiltreMagasin(where, user);
    const logs = await LogCaisse.findAll({
        attributes: [
            'message',
            [sequelize.fn('COUNT', sequelize.col('*')), 'nombre'],
        ],
        where,
        group: ['message'],
    });

    return logs;
}

/**
 * Récupère les logs de caisse filtrés par date et message.
 * @param {string} date - La date pour laquelle les logs sont récupérés.
 * @param {string} message - Le message à filtrer.
 * @param {Object} user - L'utilisateur pour appliquer des filtres supplémentaires.
 * @returns {Promise<Array>} - Un tableau des logs correspondant aux critères.
 * @throws {Error} - Si le message n'est pas fourni.
 */
async function getLogCaisse(date, message, user){
    date = verifyDate(date);
    if(!message)
        throw new Error("Veuillez renseigner la message");
    
    const where = {
        [Op.and]: [
            getConditionDate(date),
            {message}
        ]
    }
    
    await addFiltreMagasin(where, user);
    let rep = await LogCaisse.findAll({where, order: [["timestamp", "ASC"]]});
    rep = dataToJson(rep);
    formatMeta(rep);
    
    return rep; 
}

/**
 * Récupère un utilisateur avec ses magasins associés.
 * @param {Object} user - L'utilisateur pour lequel les magasins sont récupérés.
 * @returns {Promise<Object>} - L'utilisateur avec ses magasins.
 */
async function getUserWithMagasins(user){
    return await db.user.findByPk(user.id, { include : ["magasins"]});
}

/**
 * Ajoute un filtre de magasins aux critères de recherche.
 * @param {Object} where - L'objet contenant les conditions de recherche.
 * @param {Object} user - L'utilisateur pour appliquer des filtres de magasins.
 */
async function addFiltreMagasin(where, user){
    user = await getUserWithMagasins(user);
    if(!user.magasins.length)
        return;
    
    const magasins = user.magasins.map((r)=> {
        return {[Op.like]: `%"magasin":"${r.nommagasin}"%`}
    }).concat(user.magasins.map((r)=> {
        return {[Op.like]: `%"magasin":"${r.identifiant}"%`}
    }));
    
    where.meta = {[Op.or]: magasins};
}

/**
 * Formate les métadonnées des logs.
 * @param {Array} list - La liste des logs à formater.
 */
function formatMeta(list){
    for(const item of list)
        item.meta = JSON.parse(item.meta)
}

module.exports = {
    getLogCaisse,
    getLogCaisseGrouped
}
