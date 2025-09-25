module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("table_synchros", {
        nom: {
            type: Sequelize.STRING(50),
        },
        colonnes: {
            type: Sequelize.TEXT,
        },
        nomId: {
            type: Sequelize.STRING(50),
        },
        nomDernierModif: {
            type: Sequelize.STRING(50),
        },
        to_delete: {
            type: Sequelize.BOOLEAN
        },
        colonneMagasin: {
            type: Sequelize.STRING(50)
        }
    },
    {
        timestamps: false
    });

    return Resp;
};
