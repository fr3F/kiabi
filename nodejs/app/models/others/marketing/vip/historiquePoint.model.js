module.exports = (sequelize, Sequelize) => {
    const HistoriquePointVip = sequelize.define("historique_point_vip", {
        numClient: {
            type: Sequelize.STRING(12)
        },
        numticket: {
            type: Sequelize.STRING(45)
        },
        magasin: {
            type: Sequelize.STRING(45)
        },
        nocaisse: {
            type: Sequelize.STRING(45)
        },
        pointAvant: {
            type: Sequelize.DOUBLE
        },
        pointApres: {
            type: Sequelize.DOUBLE
        },
        equivalenceAjout: {
            type: Sequelize.DOUBLE
        },
        equivalenceConso: {
            type: Sequelize.DOUBLE
        }
    }, {
        freezeTableName: true, // Fige le nom de la table
    });

    return HistoriquePointVip;
}