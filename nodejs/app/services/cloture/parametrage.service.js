const { validerRequete } = require("../../helpers/form.helper");
const helper = require("../../helpers/helpers.helper");

const db = require("./../../models");
const sequelize = db.sequelize;

const ParametrageCloture = db.parametrageCloture;
const ItemParametrage = db.itemParametrageCloture;

function verifierParametrageCloture(body){
    const att = ["designation", ];
    const nomAtt = ["Désignation"];
    validerRequete(body, att, nomAtt);
    if(!Array.isArray(body.idMagasins) || !body.idMagasins.length)
        throw new Error("Veuillez séléctionner au moins un magasin");
}



async function createParametrageCloture(body){
    await verifierParametrageCloture(body);
    await helper.verifierAttributUnique(ParametrageCloture, body.designation, "", "designation", "Désignation");
    await sequelize.transaction(async (transaction)=>{
        body.id =  (await ParametrageCloture.create(body, {transaction})).id;
        await insertItems(body, body.id, transaction);
    })
    return body;
}


async function insertItems(body, idParametrage, transaction){
    const items = body.idMagasins.map((r)=>{
        return {idMagasin: r, idParametrage}
    });
    await ItemParametrage.destroy({where: {idParametrage}, transaction});
    try{
        await ItemParametrage.bulkCreate(items, {transaction});
    }
    catch(err){
        if(err.code == 'ER_DUP_ENTRY')
            throw new Error("Un magasin est déjà paramétré dans un autre paramétrage");
    }
}

async function updateParametrageCloture(id, body){
    const old = await helper.verifierExistence(ParametrageCloture, id, "Paramétrage");
    await verifierParametrageCloture(body);   
    await helper.verifierAttributUnique(ParametrageCloture, body.designation, id, "designation", "Désignation");
    await sequelize.transaction(async (transaction)=>{
        await ParametrageCloture.update(body, {transaction, where: {id}});
        await insertItems(body, id, transaction);
    })
    return body;
}

async function deleteParametrageCloture(id){
    await helper.verifierExistence(ParametrageCloture, id, "Paramétrage")
    await sequelize.transaction(async (transaction)=>{
        await ItemParametrage.destroy({where: {idParametrage: id}, transaction})
        await ParametrageCloture.destroy({where: {id}, transaction});
    });
}

async function getListParametrageCloture(req){
    return await ParametrageCloture.findAll({
        include: [
            {model: ItemParametrage, as: "items", include: ["magasin"]}
        ]
    });
};

function getOptionGetList(req, limit, offset){
    let filters = getFiltreRecherche(req);
    return {
        where: filters,
        limit, offset,
    };
}

function getFiltreRecherche(req){
    let filters = helper.getFiltreRecherche(req, ["designation"]);
    if(!req.query.search)
        filters = {};
    return filters;
}

async function findById(id){
    let rep = await helper.verifierExistence(ParametrageCloture, id, "Paramétrage", [
        {model: ItemParametrage, as: "items", include: ["magasin"]}
    ]);
    return rep;
} 

async function getMagasinsParametrage(){
    const magasins = await db.Magasin.findAll({include: ["parametrageCloture"]});
    return magasins.filter((r)=> !r.parametrageCloture);
}

module.exports = {
    createParametrageCloture,
    getListParametrageCloture,
    findById,
    updateParametrageCloture,
    deleteParametrageCloture,
    getMagasinsParametrage
}