module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("itemencaissement", {
        monnaie: {
            type: Sequelize.DOUBLE
        },
        type: {
            type: Sequelize.INTEGER
        },
        qte: {
            type: Sequelize.DOUBLE
        },
        montant: {
            type: Sequelize.DOUBLE
        },
    },
    {
        tableName: "itemencaissement",
    }
    );

    return Resp;
};
