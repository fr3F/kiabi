const { findById, generateKey } = require("./devis.service");
const db = require('../../../../../../gestion-caisse/nodejs/app/models');
const sequelize = db.sequelize;
const ItemDevis = db.itemDevis;
const Devis = db.devis;

async function duplicateDevis(id, idUser, nombre){
    if(isNaN(nombre) || nombre <= 0)
        throw new Error("Le nombre doit être positif");
    const devis = await findById(id);
    if(devis.statut != "Nouveau")
        throw new Error("Le devis n'est pas de statut 'Nouveau'");
    await sequelize.transaction(async (transaction)=> {
        for(let i = 0; i < nombre; i++){
            await duplicateOneDevis(devis, idUser, transaction);
        }    
    });
}

async function duplicateOneDevis(devis, idUser, transaction){
    delete devis.id;
    devis.idUser = idUser;
    devis.securedKey = generateKey(devis.type);
    const data = await Devis.create(devis, {transaction});
    if(!devis.items.length)
        return;
    for(const item of devis.items){
        delete item.id;
        item.idDevis = data.id;
    }
    await ItemDevis.bulkCreate(devis.items, {transaction});
}

module.exports = {
    duplicateDevis
}
