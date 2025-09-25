module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("client", {
        code: {
            type: Sequelize.STRING(17),
            primaryKey: true
        },
        intitule: {
            type: Sequelize.STRING(35),
        },
        cptgeneral: {
            type: Sequelize.STRING(13),
        },
        catTarif: {
            type: Sequelize.INTEGER,
        },
        dateModification: {
            type: Sequelize.DATE
        },
    },
    {
        tableName: "client",
        timestamps: false
    }
    );

    return Resp;
};
