const { validerRequete } = require("../../../helpers/form.helper");
const { verifierAttributUnique, replaceAll, uploadFileAsync, verifierExistence } = require("../../../helpers/helpers.helper");
const db = require("./../../../models");

const Parametrage = db.parametrageEtiquetage;
const path = __basedir + "/public/parametrage-etiquetages/"

async function createParametrage(parametrage){
    await verifierParametrage(parametrage, "");
    const data = await Parametrage.create(parametrage);
    await uploadParametrageImage(parametrage);
    return data;
}

async function updateParametrage(id, parametrage){
    await verifierParametrage(parametrage, id);
    await Parametrage.update(parametrage, {where: {id}});
    await uploadParametrageImage(parametrage);
    return parametrage;
}


async function verifierParametrage(parametrage, id){
    const att = ["designation", "largeur", "hauteur"];
    const nomAtt = ["Désignation", "Largeur", "Hauteur"];
    const typeAtt = ["str", "nb", "nb"]
    validerRequete(parametrage, att, nomAtt, typeAtt);
    await verifierAttributUnique(Parametrage, parametrage.designation, id, "designation", "Désignation");
    if(!id && !parametrage.imageFile)
        throw new Error("Veuillez renseigner l'image")
    parametrage.image = replaceAll(parametrage.designation, " ", "-") + ".png";
}

async function uploadParametrageImage(parametrage){
    if(parametrage.imageFile){
        const imagePath = path + parametrage.image;
        await uploadFileAsync(parametrage.imageFile, imagePath);
    }
}

async function findById(id){
    return await verifierExistence(Parametrage, id, "Paramétrage étiquettage");
}


async function deleteParametrage(id){
    await findById(id);
    await Parametrage.destroy({where: {id}})
}

async function findAll(){
    return await Parametrage.findAll();
}

module.exports = {
    createParametrage,
    updateParametrage,
    findAll,
    findById,
    deleteParametrage
}