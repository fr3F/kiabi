const { findById } = require("./client-vip.service");
const helper = require("../../../helpers/helpers.helper");
const { ErrorCode } = require("../../../helpers/error");
const { clientVip: ClientVip } = require("../../../models");


async function activateCarteVip(id, moisValidation){
    verifyMois(moisValidation);
    await verifyClientToActivate(id);
    const dateActivation = new Date();
    const dateExpiration = getDateExpiration(dateActivation, moisValidation);
    await updateClientVip(id, dateActivation, dateExpiration, moisValidation);
    return { dateActivation, dateExpiration, moisValidation };
}

async function verifyClientToActivate(id) {
    const client = await findById(id)
    if(client.dateActivation)
        throw new ErrorCode("Ce client est déjà activé");
}


function verifyMois(moisValidation){
    if(!helper.isNumber(moisValidation) || moisValidation <= 0)
        throw new ErrorCode("Veuillez renseigner un mois valide");
}

function getDateExpiration(dateActivation, moisValidation){
    const dateExpiration = new Date(dateActivation);
    dateExpiration.setMonth(dateExpiration.getMonth() + moisValidation);
    return dateExpiration;
}

async function updateClientVip(id, dateActivation, dateExpiration, moisValidation) {
    await ClientVip.update(
        { dateActivation, dateExpiration, moisValidation },
        { where: { id } }
    );
}

module.exports = {
    activateCarteVip,
    getDateExpiration
}