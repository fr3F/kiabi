const { clientVip: ClientVip } = require("../../../../../models");
const { insertHistoriquePointAdd } = require("../../carte-vip/services/historique.service");
const { findAndVerifyEquivalence } = require("../../carte-vip/services/update.service");

async function addPointLoyactWithTest(clientVip, pointToAdd, numticket, transaction){
    if(!pointToAdd)
        return;
    await addPointLoyact(clientVip, pointToAdd, numticket, transaction);
}

async function addPointLoyact(clientVip, pointToAdd, numticket, transaction){
    const equivalence = await findAndVerifyEquivalence();
    const ticket = buildTicket(numticket);
    const point = calculPoint(clientVip, pointToAdd);
    await insertHistoriquePointAdd(pointToAdd, clientVip, ticket, equivalence, transaction);
    await ClientVip.update({point}, {where: {id: clientVip.id}, transaction});
}

function buildTicket(numticket){
    return {
        numticket,
        datecreation: new Date()
    }
}

function calculPoint(clientVip, pointToAdd){
    return parseInt(clientVip.point) + parseInt(pointToAdd);
}

module.exports = {
    addPointLoyactWithTest
}