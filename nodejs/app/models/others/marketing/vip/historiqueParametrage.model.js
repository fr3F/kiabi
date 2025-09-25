module.exports = (sequelize, Sequelize) => {
    const HistoriqueParamVip = sequelize.define("historique_param_vip", {
        type: {
            type: Sequelize.STRING(15)
        },
        montantAvant: {
            type: Sequelize.DOUBLE
        },
        montantApres: {
            type: Sequelize.DOUBLE
        }
    }, {
        freezeTableName: true, // Fige le nom de la table
    });

    return HistoriqueParamVip;
}