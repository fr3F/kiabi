module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("historique_table_caisses", {
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        nbModifies: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        nbNouveaux: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    },
    {
        timestamps: false
    });

    return Resp;
};
