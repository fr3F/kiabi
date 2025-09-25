const { escape } = require("mysql2");
const { verifierExistence } = require("../../../../../helpers/helpers.helper");
const { Magasin, HistoriquePointVip, Sequelize } = require("../../../../../models");
const { getDataMagasinDb } = require("../../../../../services/dashboard/util.service");
const { ErrorCode } = require("../../../../../helpers/error");
const { Op } = require("sequelize");

async function verifyTicketCaisse(numClient, numticket, magasin, nocaisse, hashticket) {
    const magasinObj = await findAndVerifyMagasin(magasin);
    const sql = makeSqlFindTicket(numClient, numticket, nocaisse, hashticket);
    const data = await getDataMagasinDb(magasinObj, sql);
    if(!data.length)
        throw new ErrorCode("Le ticket n'est pas valide");
    await verifyTicketAlreadyAdded(numticket, magasin, nocaisse);
    return data[0];
}

async function findAndVerifyMagasin(magasin){
    return await verifierExistence(Magasin, magasin, "Magasin", [], null, "nommagasin");
}

function makeSqlFindTicket(numClient, numticket, nocaisse, hashticket){
   return `SELECT * FROM ticket WHERE
        clientvip = ${escape(numClient)}
        AND numticket = ${escape(numticket)}
        AND nocaisse = ${escape(nocaisse)}
        AND hash = ${escape(hashticket)}
   `;   
}

async function verifyTicketAlreadyAdded(numticket, magasin, nocaisse){
    const exist = await findTicketInHistory(numticket, magasin, nocaisse);
    if(exist)
        throw new ErrorCode("Ce ticket est déjà utilisé");
}

async function findTicketInHistory(numticket, magasin, nocaisse) {
    return await HistoriquePointVip.findOne({
        where: {
            numticket,
            magasin,
            nocaisse,
            pointAvant: {
                [Op.lt]: Sequelize.col('pointApres'),
            },
        }
    });
}

module.exports = {
    verifyTicketCaisse,
    verifyTicketAlreadyAdded
}