module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("stockmagasin", {
        reference: {
            type: Sequelize.STRING(18),
        },
        gamme: {
            type: Sequelize.STRING(25),
        },
        quantite: {
            type: Sequelize.DOUBLE,
        },
        depot: {
            type: Sequelize.STRING(45),
        },
        dateModification: {
            type: Sequelize.DATE
        },
        cbMarq1: {
            type: Sequelize.INTEGER
        },
        cbMarq2: {
            type: Sequelize.INTEGER
        }
    },
    {
        tableName: "stockmagasin",
        timestamps: false
    }
    );

    return Resp;
};
