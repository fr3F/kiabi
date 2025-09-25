
const { isInteger, isDate } = require("../../helpers/form.helper");
const db = require("./../../models");
const Devise = db.devise;
const helper = require("../../helpers/helpers.helper");

async function changeDeviseIfNotExist({date, montant}, idUser = null) {
    const exist = await Devise.findOne({where: {date}});
    if(!exist)
        await changeDevise({date, montant}, idUser);
}

async function changeDevise({date, montant}, idUser = null){
    verifyDateAndMontant(date, montant);
    const updatedAt = new Date();
    const data = [{date, montant, idUser, updatedAt}];
    await Devise.bulkCreate(data, {updateOnDuplicate: ["montant", "idUser", "updatedAt"]});
}

function verifyDateAndMontant(date, montant){
    if(!montant || !isInteger(montant) || montant < 0)
        throw new Error("Veuillez renseigner un montant positif");
    if(!isDate(date))
        throw new Error("Veuillez renseigner une date valide");
}

async function getListDevise(req){
    let { page, limit, offset } = helper.getVarNecessairePagination(req);
    let option = getOptionGetList(req, limit, offset);
    let rep = await Devise.findAndCountAll(option);
    rep = helper.dataToJson(rep);
    return helper.getPagingData(rep, page, limit)
};

function getOptionGetList(req, limit, offset){
    return {
        include: ["user"],
        limit, offset,
        order: [["date", "DESC"]]
    };
}

module.exports = {
    getListDevise,
    changeDevise,
    changeDeviseIfNotExist
}