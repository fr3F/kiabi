module.exports = (sequelize, Sequelize) => {
    const ParametrageVip = sequelize.define("parametrage_vip", {
        equivalenceAjout: {
            type: Sequelize.DOUBLE
        },
        equivalenceConso: {
            type: Sequelize.DOUBLE
        },
        pointMinimum: {
            type: Sequelize.DOUBLE,
            defaultValue: 0
        },
        tauxDiscount: {
            type: Sequelize.DOUBLE,
            defaultValue: 0
        },
        type: {
            type: Sequelize.INTEGER,
            defaultValue: 1                         // 1 montant, 2 pourcentage
        }
    }, {
        freezeTableName: true, // Fige le nom de la table
    });

    return ParametrageVip;
}