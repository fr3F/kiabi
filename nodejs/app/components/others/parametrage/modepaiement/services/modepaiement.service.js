const { validerRequete } = require("../../../../../helpers/form.helper");
const helper = require("../../../../../helpers/helpers.helper");

const db = require("../../../../../models");
const sequelize = db.sequelize;

const ModepaiementStandard = db.ModePaiementStandard;
const Magasin = db.Magasin;
const Modepaiement = db.ModePaiement;

const types = ["cash", "cheque", "mobile money", "carte", "virement", "acompte", "avoir"];


function verifierModepaiementStandard(body){
    const att = ["designation", "type", "codejournal", "noreglement", "financingType"];
    const nomAtt = ["Désignation", "Type", "Code journal", "N° règlement (sage)", "Financing type"];
    validerRequete(body, att, nomAtt);
    if(types.indexOf(body.type) == -1)
        throw new Error("Type invalide");
}

async function getAllMagasins(){
    return await Magasin.findAll();
}

async function generateModePaiements(modepaiementStandard, existants = []){
    const magasins = await getAllMagasins();
    const rep = [];
    for(const magasin of magasins){
        const item = generateModePaiement(modepaiementStandard, magasin, existants);
        rep.push(item);
    } 
    return rep;
}

function generateModePaiement(modepaiementStandard, magasin, existants){
    const item = {...modepaiementStandard}
    delete item.id;
    item.magasin = magasin.identifiant;
    const existant = existants.find((r)=> r.nommagasin == item.nommagasin);
    if(existant)
        item.id = existant.id;
    return item;
}

async function createModepaiementStandard(body){
    await verifierModepaiementStandard(body);
    await helper.verifierAttributUnique(ModepaiementStandard, body.designation, "", "designation", "Désignation");
    const modepaiements = await generateModePaiements(body, []);
    await sequelize.transaction(async (transaction)=>{
        body.id =  (await ModepaiementStandard.create(body, {transaction})).id;
        await bulkCreateModePaiements(modepaiements, transaction);
    })
    return body;
}

async function bulkCreateModePaiements(modepaiements, transaction){
    if(!modepaiements.length)
        return;
    await Modepaiement.bulkCreate(modepaiements, {
        transaction,
        updateOnDuplicate: ["designation", "codejournal", "noreglement", "magasin", "type", "financingType"]
    })
}

async function updateModepaiementStandard(id, body){
    const old = await helper.verifierExistence(ModepaiementStandard, id, "Mode de paiement");
    await verifierModepaiementStandard(body);   
    await helper.verifierAttributUnique(ModepaiementStandard, body.designation, id, "designation", "Désignation");
    await sequelize.transaction(async (transaction)=>{
        body.dateModification = new Date();
        await ModepaiementStandard.update(body, {transaction, where: {id}});
        await updateModepaiements(body, old, transaction);
    })
    return body;
}

async function updateModepaiements(body, old, transaction) {
    await Modepaiement.update(
        {
            type: body.type, 
            financingType: body.financingType,
            dateModification: new Date()
        }, 
        {transaction, where: {designation: old.designation}}
    );
}


async function deleteModepaiementStandard(id){
    const modepaiementStandard = await helper.verifierExistence(ModepaiementStandard, id, "Mode de paiement")
    await sequelize.transaction(async (transaction)=>{
        await ModepaiementStandard.destroy({where: {id}, transaction});
        await Modepaiement.destroy({where: {designation: modepaiementStandard.designation}, transaction});
    });
}

async function getListModepaiementStandard(req){
    let { page, limit, offset } = helper.getVarNecessairePagination(req);
    let option = getOptionGetList(req, limit, offset);
    let rep = await ModepaiementStandard.findAndCountAll(option);
    rep = helper.dataToJson(rep);
    return helper.getPagingData(rep, page, limit)
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
    let rep = await helper.verifierExistence(ModepaiementStandard, id, "ModepaiementStandard");
    return rep;
} 

module.exports = {
    createModepaiementStandard,
    getListModepaiementStandard,
    findById,
    updateModepaiementStandard,
    deleteModepaiementStandard,
    bulkCreateModePaiements
}