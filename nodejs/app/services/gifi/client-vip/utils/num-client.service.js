const { ErrorCode } = require("../../../../helpers/error");
const { ParamNumClient } = require("../../../../models");

async function getNextNumClient(transaction) {
    const row = await getUnusedClientNumber(transaction);
    if (!row)
        throw new ErrorCode("Aucun numéro client disponible");

    await markClientAsUsed(row, transaction);

    return row.numero;
}

async function getUnusedClientNumber(transaction) {
    return await ParamNumClient.findOne({
        where: { utiliser: 0 },
        order: [['id', 'ASC']],
        transaction,
        lock: transaction.LOCK.UPDATE
    });
}

async function markClientAsUsed(row, transaction) {
    await row.update({ utiliser: 1 }, { transaction });
}

async function findExistingNumero(transaction) {
    return await ParamNumClient.findOne({transaction})
}

module.exports = {
    getNextNumClient,
    findExistingNumero
}
