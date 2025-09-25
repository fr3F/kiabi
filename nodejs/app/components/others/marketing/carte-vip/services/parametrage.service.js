const { validerRequete } = require("../../../../../helpers/form.helper");
const { ParametrageVip, HistoriqueParamVip, sequelize } = require("../../../../../models");

const TYPE_HISTORY = {
    ajout: "Gain",
    conso: "Consommation",
    pointMin: "Point min",
    tauxDiscount: "Taux discount",
    type: "Type",

}

async function updateParametrage(parametrage, idUser) {
    validateParametrage(parametrage);
    const exist = await findExistParametrage();
    const historiques = generateHistoriques(exist, parametrage, idUser);
    await insertParametrage(exist, parametrage, historiques);
}

async function insertParametrage(exist, parametrage, historiques) {
    await sequelize.transaction(async (transaction)=>{
        if(exist)
            await ParametrageVip.update(parametrage, {where: {id: exist.id}, transaction});
        else    
            await ParametrageVip.create(parametrage, {transaction});    
        await insertHistoriques(historiques, transaction);
    })
}

async function insertHistoriques(historiques, transaction) {
    if(historiques.length)
        await HistoriqueParamVip.bulkCreate(historiques, { transaction });
}

function validateParametrage(parametrage){
    const attributes = ["equivalenceAjout", "equivalenceConso", "pointMinimum", "type", "tauxDiscount"];
    const attributeNames = ["Equivalence ajout", "Equivalence consommation", "Point minimum pour consommer", "type", "tauxDiscount"];
    const attributeTypes = ["nb", "nb", "nb", "nb", "nb"];
    validerRequete(parametrage, attributes, attributeNames, attributeTypes);
}

async function findExistParametrage(){
    return await ParametrageVip.findOne();
}

function generateHistoriques(exist, parametrage, idUser) {
    if(!exist)
        exist = {};
    const list = [];
    addHistoriqueAjout(exist, parametrage, list, idUser);
    addHistoriqueConso(exist, parametrage, list, idUser);
    addHistoriquePointMin(exist, parametrage, list, idUser);
    addHistoriqueTaux(exist, parametrage, list, idUser);
    addHistoriqueType(exist, parametrage, list, idUser);
    return list;
}

function addHistoriqueAjout(exist, parametrage, list, idUser){
    addHistoriqueGeneric(exist, parametrage, list, idUser, 
        TYPE_HISTORY.ajout, "equivalenceAjout");
}

function addHistoriqueConso(exist, parametrage, list, idUser){
    addHistoriqueGeneric(exist, parametrage, list, idUser, 
        TYPE_HISTORY.conso, "equivalenceConso");
}

function addHistoriquePointMin(exist, parametrage, list, idUser){
    addHistoriqueGeneric(exist, parametrage, list, idUser, 
        TYPE_HISTORY.pointMin, "pointMinimum");
}

function addHistoriqueType(exist, parametrage, list, idUser){
    addHistoriqueGeneric(exist, parametrage, list, idUser, 
        TYPE_HISTORY.type, "type");
}

function addHistoriqueTaux(exist, parametrage, list, idUser){
    addHistoriqueGeneric(exist, parametrage, list, idUser, 
        TYPE_HISTORY.tauxDiscount, "tauxDiscount");
}
function addHistoriqueGeneric(exist, parametrage, list, idUser, type, attribute){
    if(exist[attribute] != parametrage[attribute]){
        const history = generateHistorique(
            exist[attribute], 
            parametrage[attribute], 
            type, 
            idUser
        );
        list.push(history);
    }
}

function generateHistorique(montantAvant, montantApres, type, idUser){
    return {
        type,
        montantAvant,
        montantApres,
        idUser 
    }
}

async function getHistoriquesParametrage() {
    return await HistoriqueParamVip.findAll({
        order: [["createdAt", "DESC"]],
        include: ["user"]
    })
}

module.exports = {
    findExistParametrage, 
    updateParametrage,
    getHistoriquesParametrage
}