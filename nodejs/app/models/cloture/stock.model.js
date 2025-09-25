module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("stocks", {
        reference: {
            type: Sequelize.STRING(18),
        },
        gamme: {
            type: Sequelize.STRING(18),
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
    },
    {
        tableName: "stocks",
        timestamps: false
    }
    );

    return Resp;
};
