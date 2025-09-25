const { findHistoriquePrixById } = require("./historique.service");

async function exportHistoriqueUpdatePrix(id){
    const historique = await findHistoriquePrixById(id);
    return "UPDATE PRIX";
}

module.exports = {
    exportHistoriqueUpdatePrix
}